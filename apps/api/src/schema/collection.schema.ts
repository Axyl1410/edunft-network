import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class HoldingItem {
  @Prop({ type: String, required: true })
  Address: string;

  @Prop({ type: String, required: true })
  TokenId: string;
}

export class OwnerItem {
  @Prop({ type: String, required: true })
  Address: string;

  @Prop({ type: String, required: true })
  name: string;
}

@Schema({ timestamps: true })
export class Collection {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: Types.ObjectId;

  @Prop({ default: [], type: [OwnerItem] })
  Owner: OwnerItem[];

  @Prop({ default: [], type: [HoldingItem] })
  Holders: HoldingItem[];
}

export type CollectionDocument = Collection & Document;

export const CollectionSchema = SchemaFactory.createForClass(Collection);
