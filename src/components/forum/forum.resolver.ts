import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
  async createForum(
    @Args('createForumInput') createForumInput: CreateForumInput,
    @CurrentUser() user: TokenPayload,
  ): Promise<Forum> {
    return this.forumService.create(createForumInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Forum], { name: 'forums' })
  async findAll(): Promise<Forum[]> {
    return this.forumService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Forum], { name: 'findForums' })
  async findForums(): Promise<Forum[]> {
    return this.forumService.findForums();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Forum, { name: 'forum' })
  async findOne(@Args('_id') _id: string): Promise<Forum> {
    return this.forumService.findOne(_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Forum)
  async updateForum(
    @Args('updateForumInput') updateForumInput: UpdateForumInput,
  ): Promise<Forum> {
    return this.forumService.update(updateForumInput.id, updateForumInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Forum)
  async removeForum(@Args('id', { type: () => String }) id: string) {
    return this.forumService.remove(id);
  }
}
