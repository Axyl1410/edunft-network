import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'File' })
  file: Types.ObjectId;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, enum: ['pending', 'confirmed', 'rejected'] })
  status: string;
}

export type ReportDocument = Report & Document;

export const ReportSchema = SchemaFactory.createForClass(Report);
