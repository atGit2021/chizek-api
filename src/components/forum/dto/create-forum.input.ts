import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateForumInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;
}
