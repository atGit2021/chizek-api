import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { ForumRepository } from './forum.repository';
import { toObjectId } from '../../common/database/utils/mongo.utils';
import { PipelineStage } from 'mongoose';
import { Forum } from './entities/forum.entity';

@Injectable()
export class ForumService {
  constructor(private readonly forumRepository: ForumRepository) {}

  async create(createForumInput: CreateForumInput, userId: string) {
    return this.forumRepository.create({
      ...createForumInput,
      userId,
      messages: [],
    });
  }

  async findAll(prePipelineStages: PipelineStage[] = []): Promise<Forum[]> {
    const forums = await this.forumRepository.model.aggregate([
      ...prePipelineStages,
      { $set: { latestMessage: { $arrayElemAt: ['$messages', -1] } } },
      { $unset: 'messages' },
      {
        $lookup: {
          from: 'users',
          localField: 'latestMessage.ownerId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);
    forums.forEach((forum) => {
      if (!forum.latestMessage?._id) {
        delete forum.latestMessage;
        return;
      }
      forum.latestMessage.user = forum.latestMessage.user[0];
      delete forum.latestMessage.userId;
      forum.latestMessage.forumId = forum._id;
    });
    return forums;
  }

  async findOne(_id: string): Promise<Forum> {
    const forums = await this.findAll([{ $match: { _id: toObjectId(_id) } }]);
    if (!forums[0]) {
      throw new NotFoundException(`No forum found with ID ${_id}`);
    }
    return forums[0];
  }

  async update(id: string, updateForumInput: UpdateForumInput) {
    return this.forumRepository.findOneAndUpdate(
      { _id: toObjectId(id) },
      updateForumInput,
    );
  }

  async remove(id: string) {
    return this.forumRepository.findOneAndDelete({ _id: toObjectId(id) });
  }
}
