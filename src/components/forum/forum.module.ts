import { Module, Logger, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumResolver } from './forum.resolver';
import { ForumRepository } from './forum.repository';
import { MessageModule } from './message/message.module';
import { ForumDocument, ForumSchema } from './entities/forum.document';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForumDocument.name, schema: ForumSchema },
    ]),
    forwardRef(() => MessageModule),
  ],
  providers: [ForumResolver, ForumService, ForumRepository, Logger],
  exports: [ForumRepository, ForumService],
})
export class ForumModule {}
