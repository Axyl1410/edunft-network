import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true, unique: true })
  web3Address: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  address?: string;

  @Prop()
  verificationContractAddress?: string; // Địa chỉ contract xác thực

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  students: Types.ObjectId[]; // Danh sách học sinh thuộc trường (tùy chọn, có thể query ngược từ Student)
}

export const SchoolSchema = SchemaFactory.createForClass(School);
