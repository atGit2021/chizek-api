import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from 'src/components/auth/current-user.decorator';
import { TokenPayload } from 'src/components/auth/token-payload.interface';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Message> {
    return this.messageService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessageArgs: GetMessagesArgs,
  ): Promise<Message[]> {
    return this.messageService.getMessages(getMessageArgs);
  }

  @Subscription(() => Message, {
    filter: (payload, variables: MessageCreatedArgs, context) => {
      const userId = context.user._id;
      const message: Message = payload.messageCreated;
      return (
        variables.forumIds.includes(message.forumId) &&
        userId !== message.user._id.toHexString()
      );
    },
  })
  // Keep the MessageCreatedArgs type definition for graphql introspection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  messageCreated(@Args() _messageCreatedArgs: MessageCreatedArgs) {
    return this.messageService.messageCreated();
  }
}
