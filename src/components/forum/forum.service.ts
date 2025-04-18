import { Injectable } from '@nestjs/common';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { ForumRepository } from './forum.repository';
import { ForumFilterInput } from './dto/forum-filter.input';

@Injectable()
export class ForumService {
  constructor(private readonly forumRepository: ForumRepository) {}

  async create(createForumInput: CreateForumInput, userId: string) {
    return this.forumRepository.create({
      ...createForumInput,
      userId,
      userIds: createForumInput.userIds || [],
      messages: [],
    });
  }
  async findAll() {
    return this.forumRepository.find({});
  }

  async findOne(_id: string) {
    return this.forumRepository.findOne({ _id: _id });
  }

  update(id: string, updateForumInput: UpdateForumInput) {
    return this.forumRepository.findOneAndUpdate({ _id: id }, updateForumInput);
  }

  remove(id: string) {
    return this.forumRepository.findOneAndDelete({ _id: id });
  }

  async findByFilterQuery(query: { filterQuery?: ForumFilterInput } = {}) {
    return this.forumRepository.find(query.filterQuery || {});
  }
}
