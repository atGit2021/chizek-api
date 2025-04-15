import { Injectable } from '@nestjs/common';
import { ForumRepository } from '../forum.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';

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
        $or: [
          { userId: ownerId },
          {
            userIds: {
              $in: [ownerId],
            },
          },
        ],
      },
      {
        $push: {
          messages: message,
        },
      },
    );
    return message;
  }
}
