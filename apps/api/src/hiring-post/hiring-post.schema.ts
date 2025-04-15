import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Enterprise } from 'src/enterprise/enterprise.schema';

export type HiringPostDocument = HiringPost & Document;

@Schema({ timestamps: true })
export class HiringPost {
  @Prop({ type: Types.ObjectId, ref: 'Enterprise', required: true })
  enterprise: Enterprise;

  @Prop({ required: true })
  enterpriseWeb3Address: string; // Để hiển thị nhanh

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  requirements: string[];
}

export const HiringPostSchema = SchemaFactory.createForClass(HiringPost);
