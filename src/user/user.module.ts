import { Module, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserResolver, UserService, UserRepository, Logger],
})
export class UserModule {}
