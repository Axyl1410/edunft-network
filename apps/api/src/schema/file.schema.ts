import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true, type: String })
  hash: string;

  @Prop({ default: null, type: String })
  name: string;

  @Prop({ default: null, type: Number })
  size: number;

  @Prop({ default: null, type: String })
  mimeType: string;

  @Prop({ enum: ['public', 'private'], required: true, type: String })
  network: string;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
