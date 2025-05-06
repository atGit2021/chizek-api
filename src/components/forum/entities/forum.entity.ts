import { ObjectType, Field } from '@nestjs/graphql';
import { AbstractEntity } from '../../../common/database/abstract.entity';
import { Message } from '../message/entities/message.entity';

@ObjectType()
export class Forum extends AbstractEntity {
  @Field()
  name: string;

  @Field(() => Message, { nullable: true })
  latestMessage?: Message;
}
