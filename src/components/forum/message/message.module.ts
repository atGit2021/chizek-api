import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ForumModule } from '../forum.module';

@Module({
  imports: [forwardRef(() => ForumModule)],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
