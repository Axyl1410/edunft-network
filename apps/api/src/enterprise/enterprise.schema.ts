import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnterpriseDocument = Enterprise & Document;

@Schema({ timestamps: true })
export class Enterprise {
  @Prop({ required: true, unique: true })
  web3Address: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  industry?: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'HiringPost' }], default: [] })
  hiringPosts: Types.ObjectId[];
}

export const EnterpriseSchema = SchemaFactory.createForClass(Enterprise);
