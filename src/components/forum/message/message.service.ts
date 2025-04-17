import { Injectable } from '@nestjs/common';
import { ForumRepository } from '../forum.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';

@Injectable()
export class MessageService {
  constructor(private readonly forumRepository: ForumRepository) {}

  async createMessage(
    { content, forumId }: CreateMessageInput,
    ownerId: string,
  ) {
    const message: Message = {
      _id: new Types.ObjectId(),
      content,
      ownerId,
      createdAt: new Date(),
    };

    await this.forumRepository.findOneAndUpdate(
      {
        _id: forumId,
        ...this.userForumFilter(ownerId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );
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
        _id: forumId,
        ...this.userForumFilter(userId),
      })
    ).messages;
  }
}
