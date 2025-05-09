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
import { MessageCreatedArgs } from './dto/message-created.args';
import { ForumService } from '../forum.service';
import { MessageDocument } from './entities/message.document';
import { UserService } from 'src/components/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly forumRepository: ForumRepository,
    private readonly forumService: ForumService,
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
      ownerId: new Types.ObjectId(ownerId),
      createdAt: new Date(),
    };

    await this.forumRepository.findOneAndUpdate(
      {
        _id: toObjectId(forumId),
        ...this.forumService.userForumFilter(ownerId),
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

  async getMessages({ forumId }: GetMessagesArgs, userId: string) {
    return (
      await this.forumRepository.findOne({
        _id: toObjectId(forumId),
        ...this.forumService.userForumFilter(userId),
      })
    ).messages;
  }

  async messageCreated({ forumId }: MessageCreatedArgs, userId: string) {
    await this.forumRepository.findOne({
      _id: toObjectId(forumId),
      ...this.forumService.userForumFilter(userId),
    });
    return this.pubSub.asyncIterableIterator(MESSAGE_CREATED);
  }
}
