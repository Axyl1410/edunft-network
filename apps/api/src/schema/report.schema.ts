import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  User: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'File' })
  File: Types.ObjectId;

  @Prop({ type: String })
  Reason: string;

  @Prop({ type: String })
  Description: string;

  @Prop({ type: String, enum: ['pending', 'confirmed', 'rejected'] })
  Status: string;
}
