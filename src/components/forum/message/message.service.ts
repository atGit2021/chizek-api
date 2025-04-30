import { Inject, Injectable } from '@nestjs/common';
import { ForumRepository } from '../forum.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';
import { toObjectId } from '../../../common/database/utils/mongo.utils';
import { PUB_SUB } from 'src/common/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';

@Injectable()
export class MessageService {
  constructor(
    private readonly forumRepository: ForumRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createMessage(
    { content, forumId }: CreateMessageInput,
    ownerId: string,
  ) {
    const message: Message = {
      _id: new Types.ObjectId(),
      content,
      ownerId,
      forumId,
      createdAt: new Date(),
    };

    await this.forumRepository.findOneAndUpdate(
      {
        _id: toObjectId(forumId),
        ...this.userForumFilter(ownerId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );
    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });
    return message;
  }

  private userForumFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    };
  }

  async getMessages({ forumId }: GetMessagesArgs, userId: string) {
    return (
      await this.forumRepository.findOne({
        _id: toObjectId(forumId),
        ...this.userForumFilter(userId),
      })
    ).messages;
  }
}
