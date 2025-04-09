import { CreateForumInput } from './create-forum.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateForumInput extends PartialType(CreateForumInput) {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  isPrivate?: boolean;

  @Field(() => [String], { nullable: true })
  userIds?: string[];
}
