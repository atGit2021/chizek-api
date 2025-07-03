import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../../common/database/abstract.entity';

@Schema({ versionKey: false })
export class UserDocument extends AbstractEntity {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
