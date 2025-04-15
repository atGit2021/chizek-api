import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from 'src/components/auth/current-user.decorator';
import { TokenPayload } from 'src/components/auth/token-payload.interface';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messageService.createMessage(createMessageInput, user._id);
  }
}
