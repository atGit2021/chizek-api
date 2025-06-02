import { Controller, Get, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumService: ForumService) {}

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async countForums() {
    return this.forumService.countForums();
  }
}
