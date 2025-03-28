import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ForumService } from './forum.service';
import { Forum } from './entities/forum.entity';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/token-payload.interface';

@Resolver(() => Forum)
export class ForumResolver {
  constructor(private readonly forumService: ForumService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Forum)
  createForum(
    @Args('createForumInput') createForumInput: CreateForumInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.forumService.create(createForumInput, user._id);
  }

  @Query(() => [Forum], { name: 'forum' })
  findAll() {
    return this.forumService.findAll();
  }

  @Query(() => Forum, { name: 'forum' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.forumService.findOne(id);
  }

  @Mutation(() => Forum)
  updateForum(@Args('updateForumInput') updateForumInput: UpdateForumInput) {
    return this.forumService.update(updateForumInput.id, updateForumInput);
  }

  @Mutation(() => Forum)
  removeForum(@Args('id', { type: () => Int }) id: number) {
    return this.forumService.remove(id);
  }
}
