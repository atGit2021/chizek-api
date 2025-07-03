import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from '../../../common/database/abstract.entity';

@ObjectType()
export class User extends AbstractEntity {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  imageUrl: string;
}
