import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  Hash: string;

  @Prop()
  Name: string;

  @Prop()
  Size: number;

  @Prop()
  Mime_type: string;

  @Prop({ enum: ['public', 'private'], required: true })
  network: string;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
