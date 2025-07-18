import { Inject, Injectable } from '@nestjs/common';
import { ForumRepository } from '../forum.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';
import { toObjectId } from '../../../common/database/utils/mongo.utils';
import { PUB_SUB } from '../../../common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { MessageDocument } from './entities/message.document';
import { UserService } from '../../user/user.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly forumRepository: ForumRepository,
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createMessage(
    { content, forumId }: CreateMessageInput,
    ownerId: string,
  ) {
    const messageDocument: MessageDocument = {
      _id: new Types.ObjectId(),
      content,
      ownerId: toObjectId(ownerId),
      createdAt: new Date(),
    };

    await this.forumRepository.findOneAndUpdate(
      {
        _id: toObjectId(forumId),
      },
      {
        $push: {
          messages: messageDocument,
        },
      },
    );

    const message: Message = {
      ...messageDocument,
      forumId,
      user: await this.userService.findOne(ownerId),
    };
    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });
    return message;
  }

  async countMessages(forumId: string): Promise<number> {
    return (
      (
        await this.forumRepository.model.aggregate([
          { $match: { _id: toObjectId(forumId) } },
          { $unwind: '$messages' },
          { $count: 'messageCount' },
        ])
      )[0]?.messageCount ?? 0
    );
  }

  async getMessages({ forumId, limit, skip }: GetMessagesArgs) {
    const messages = await this.forumRepository.model.aggregate([
      { $match: { _id: toObjectId(forumId) } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'ownerId' },
      { $set: { forumId } },
    ]);
    for (const message of messages) {
      message.user = await this.userService.toEntity(message.user);
    }
    return messages;
  }

  messageCreated() {
    return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
  }
}
