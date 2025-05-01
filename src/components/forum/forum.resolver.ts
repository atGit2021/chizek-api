import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ForumService } from './forum.service';
import { Forum } from './entities/forum.entity';
import { CreateForumInput } from './dto/create-forum.input';
import { UpdateForumInput } from './dto/update-forum.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/token-payload.interface';
import { ForumFilterInput } from './dto/forum-filter.input';

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

  @UseGuards(GqlAuthGuard)
  @Query(() => [Forum], { name: 'forums' })
  findAll(@CurrentUser() user: TokenPayload) {
    return this.forumService.findAll(user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Forum, { name: 'forum' })
  findOne(@Args('_id') _id: string) {
    return this.forumService.findOne(_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Forum)
  updateForum(@Args('updateForumInput') updateForumInput: UpdateForumInput) {
    return this.forumService.update(updateForumInput.id, updateForumInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Forum)
  removeForum(@Args('id', { type: () => String }) id: string) {
    return this.forumService.remove(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Forum], { name: 'findForums' })
  findForums(
    @Args('filterQuery', { type: () => ForumFilterInput, nullable: true })
    filterQuery?: ForumFilterInput,
  ) {
    return this.forumService.findByFilterQuery({ filterQuery });
  }
}
