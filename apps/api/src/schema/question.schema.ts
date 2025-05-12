import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;
}

export type QuestionDocument = Question & Document;

export const QuestionSchema = SchemaFactory.createForClass(Question);
