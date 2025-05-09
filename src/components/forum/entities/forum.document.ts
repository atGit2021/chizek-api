import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { MessageDocument } from '../message/entities/message.document';

@Schema()
export class ForumDocument extends AbstractEntity {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop([MessageDocument])
  messages: MessageDocument[];
}

export const ForumSchema = SchemaFactory.createForClass(ForumDocument);
