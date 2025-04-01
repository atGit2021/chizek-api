import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumResolver } from './forum.resolver';
import { ForumRepository } from './forum.repository';
import { Forum, ForumSchema } from './entities/forum.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
  ],
  providers: [ForumResolver, ForumService, ForumRepository, Logger],
})
export class ForumModule {}
