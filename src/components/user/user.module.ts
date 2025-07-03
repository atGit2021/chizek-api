import { Module, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../../common/database/database.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { S3Module } from 'src/common/s3/s3.module';
import { UserSchema } from './entities/user.document';

@Module({
  imports: [
    S3Module,
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserResolver, UserService, UserRepository, Logger],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
