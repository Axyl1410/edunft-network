import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Author {
  @Prop({ required: true, type: String })
  walletAddress: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  avatar: string;
}

export class Answer {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: Author })
  author: Author;

  @Prop({ default: 0, type: Number })
  votes: number;

  @Prop({ default: false, type: Boolean })
  isAccepted: boolean;

  @Prop({ type: String })
  blockchainTxHash: string;

  @Prop({ type: String })
  blockchainVoteTxHash: string;

  @Prop({ type: String })
  blockchainAcceptTxHash: string;
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number })
  tokens: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0, type: Number })
  votes: number;

  @Prop({ required: true, type: Author })
  author: Author;

  @Prop({ default: 0, type: Number })
  views: number;

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];

  @Prop({ type: String })
  timeLeft: string;

  @Prop({ type: String })
  blockchainTxHash: string;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
