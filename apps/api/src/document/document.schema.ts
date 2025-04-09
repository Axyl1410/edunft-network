import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Students } from '../students/entities/students';

export type DocumentDocument = Documents & Document;

@Schema({ timestamps: true })
export class Documents {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  owner: Students; // Tham chiếu đến người sở hữu

  @Prop({ required: true })
  ownerWeb3Address: string; // Để hiển thị nhanh

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  fileHash: string; // Hash trên IPFS hoặc tương tự

  @Prop({ required: true, default: 0 })
  price: number; // Giá bán (token)

  @Prop()
  category?: string;
}

export const DocumentsSchema = SchemaFactory.createForClass(Documents);
