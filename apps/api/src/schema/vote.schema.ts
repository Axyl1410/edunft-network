import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Vote {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  User: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'File' })
  File: Types.ObjectId;

  @Prop({ required: true, type: String, enum: ['upvote', 'downvote'] })
  voteType: string;
}

export type VoteDocument = Vote & Document;

export const VoteSchema = SchemaFactory.createForClass(Vote);
