import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true, type: String })
  Hash: string;

  @Prop({ default: null, type: String })
  Name: string;

  @Prop({ default: null, type: Number })
  Size: number;

  @Prop({ default: null, type: String })
  Mime_type: string;

  @Prop({ enum: ['public', 'private'], required: true, type: String })
  Network: string;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
