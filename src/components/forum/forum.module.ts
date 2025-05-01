import { Module, Logger, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumResolver } from './forum.resolver';
import { ForumRepository } from './forum.repository';
import { Forum, ForumSchema } from './entities/forum.entity';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
    forwardRef(() => MessageModule),
  ],
  providers: [ForumResolver, ForumService, ForumRepository, Logger],
  exports: [ForumRepository, ForumService],
})
export class ForumModule {}
