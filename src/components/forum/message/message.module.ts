import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ForumModule } from '../forum.module';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [forwardRef(() => ForumModule), UserModule],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
