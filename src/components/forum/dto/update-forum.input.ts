import { CreateForumInput } from './create-forum.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateForumInput extends PartialType(CreateForumInput) {
  @Field(() => Int)
  id: number;
}
