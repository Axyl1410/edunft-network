import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Students } from 'src/students/entities/students';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student: Students; // Người đặt câu hỏi

  @Prop({ required: true })
  studentWeb3Address: string; // Để hiển thị nhanh

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: 0 })
  rewardToken: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Answer' }], default: [] })
  answers: Types.ObjectId[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
