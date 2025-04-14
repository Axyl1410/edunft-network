import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { School } from 'src/school/class/school';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, unique: true })
  web3Address: string; // Địa chỉ ví web3 (primary identifier)

  @Prop({ required: true })
  fullName: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ type: Types.ObjectId, ref: 'School' })
  school?: School; // Tham chiếu đến trường học

  @Prop()
  grade?: string;

  @Prop()
  major?: string;

  @Prop()
  transcriptHash?: string; // Hash bảng điểm đã xác thực

  @Prop({ default: 0 })
  tokenBalance: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Document' }], default: [] })
  documentsForSale: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }], default: [] })
  questionsAsked: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Answer' }], default: [] })
  answersGiven: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
