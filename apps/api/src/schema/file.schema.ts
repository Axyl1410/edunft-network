import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
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
  Created_at: string;

  @Prop()
  Mime_type: string;

  @Prop({ default: false })
  isPrivate: boolean;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
