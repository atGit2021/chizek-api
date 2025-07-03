import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UserDocument } from './entities/user.document';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    protected readonly logger: Logger,
  ) {
    super(userModel, logger);
  }
}
