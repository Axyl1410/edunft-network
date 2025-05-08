import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class HoldingItem {
  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  tokenId: string;
}

export class OwnerItem {
  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  name: string;
}

@Schema({ timestamps: true })
export class Collection {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ default: [], type: [OwnerItem] })
  owner: OwnerItem[];

  @Prop({ default: [], type: [HoldingItem] })
  holders: HoldingItem[];
}

export type CollectionDocument = Collection & Document;

export const CollectionSchema = SchemaFactory.createForClass(Collection);
