import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Message } from '../message/entities/message.entity';

@Schema()
export class ForumDocument extends AbstractEntity {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop([Message])
  messages: Message[];
}

export const ForumSchema = SchemaFactory.createForClass(ForumDocument);
