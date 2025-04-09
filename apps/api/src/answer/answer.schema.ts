import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Question } from 'src/question/question.schema';
import { Student } from 'src/students/students.schema';

export type AnswerDocument = Answer & Document;

@Schema({ timestamps: true })
export class Answer {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  question: Question;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  answerer: Student;

  @Prop({ required: true })
  answererWeb3Address: string; // Để hiển thị nhanh

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: false })
  rewardClaimed: boolean;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
