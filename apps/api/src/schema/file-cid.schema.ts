import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { File } from './file.schema';

export type FileCIDDocument = FileCID & Document;

const ItemSchemaStructure = {
  itemId: { type: String, required: true },
  name: { type: String },
  isNFT: { type: Boolean, default: false },
};

@Schema({ timestamps: true })
export class FileCID {
  @Prop({ required: true, unique: true, index: true })
  address: string; // Địa chỉ định danh (chính là File CID), phải là duy nhất

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File', // Tham chiếu đến model 'File'
    required: true,
    index: true,
  })
  file: File; // Tham chiếu đến File Document (chứa địa chỉ ví sở hữu)

  @Prop([raw(ItemSchemaStructure)])
  items: Record<string, any>[];
}

export const FileCIDSchema = SchemaFactory.createForClass(FileCID);
