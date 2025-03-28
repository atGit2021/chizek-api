import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumResolver } from './forum.resolver';
import { ForumRepository } from './forum.repository';

@Module({
  providers: [ForumResolver, ForumService, ForumRepository],
})
export class ForumModule {}
