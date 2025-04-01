import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ForumFilterInput {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => Boolean, { nullable: true })
  isPrivate?: boolean;

  @Field(() => [String], { nullable: true })
  userIds?: string[];

  @Field(() => String, { nullable: true })
  name?: string;
}
