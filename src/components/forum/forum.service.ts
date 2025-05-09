import { Injectable } from '@nestjs/common';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { ForumRepository } from './forum.repository';
import { ForumFilterInput } from './dto/forum-filter.input';
import { toObjectId } from '../../common/database/utils/mongo.utils';

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
  async findAll() {
    return this.forumRepository.find({});
  }

  async findOne(_id: string) {
    return this.forumRepository.findOne({ _id: toObjectId(_id) });
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

  async findByFilterQuery(query: { filterQuery?: ForumFilterInput } = {}) {
    return this.forumRepository.find(query.filterQuery || {});
  }

  /* TODO: private forums
  UserForumFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
        { isPrivate: false },
      ],
    };
  }
    */
}
