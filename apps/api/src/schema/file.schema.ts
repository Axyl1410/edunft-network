import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true, unique: true, index: true })
  address: string; // Địa chỉ ví sở hữu, phải là duy nhất
}

export const FileSchema = SchemaFactory.createForClass(File);
