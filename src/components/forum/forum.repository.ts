import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from './entities/forum.entity';

@Injectable()
export class ForumRepository extends AbstractRepository<Forum> {
  constructor(
    @InjectModel(Forum.name) forumModel: Model<Forum>,
    protected readonly logger: Logger,
  ) {
    super(forumModel, logger);
  }
}
