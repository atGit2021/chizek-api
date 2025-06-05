import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/components/auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async countMessages(@Query('forumId') forumId: string) {
    return this.messageService.countMessages(forumId);
  }
}
