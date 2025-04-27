import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class HoldingItem {
  @Prop({ required: true })
  Address: string;

  @Prop({ default: [] })
  TokenId: string[];
}

@Schema({ timestamps: true })
export class Collection {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: Types.ObjectId;

  @Prop({ default: [] })
  Owner: string[];

  @Prop({ default: [] })
  Holders: HoldingItem[];
}

export type CollectionDocument = Collection & Document;

export const CollectionSchema = SchemaFactory.createForClass(Collection);
