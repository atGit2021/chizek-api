import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumDocument } from './entities/forum.document';

@Injectable()
export class ForumRepository extends AbstractRepository<ForumDocument> {
  constructor(
    @InjectModel(ForumDocument.name) forumModel: Model<ForumDocument>,
    protected readonly logger: Logger,
  ) {
    super(forumModel, logger);
  }
}
