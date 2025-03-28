import { Injectable } from '@nestjs/common';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { ForumRepository } from './forum.repository';

@Injectable()
export class ForumService {
  constructor(private readonly forumRepository: ForumRepository) {}

  async create(createForumInput: CreateForumInput, userId: string) {
    return this.forumRepository.create({
      ...createForumInput,
      userId,
      userIds: createForumInput.userIds || [],
    });
  }

  findAll() {
    return `This action returns all forum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} forum`;
  }

  update(id: number, updateForumInput: UpdateForumInput) {
    return `This action updates a #${id} forum with ${updateForumInput}`;
  }

  remove(id: number) {
    return `This action removes a #${id} forum`;
  }
}
