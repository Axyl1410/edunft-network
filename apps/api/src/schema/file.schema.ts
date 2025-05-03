import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  Hash: string;

<<<<<<< HEAD
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  Description: string;

  @Prop({ required: true })
  Size: number;

  @Prop({ required: true })
=======
  @Prop({ default: null })
  Name: string;

  @Prop({ default: null })
  Size: number;

  @Prop({ default: null })
>>>>>>> 18967a0380cd202de4435f70bad9904d1b54e287
  Mime_type: string;

  @Prop({ required: true })
  IpfsHash: string;

  @Prop()
  MainImageIpfsHash: string;

  @Prop({ type: [String] })
  SubImagesIpfsHashes: string[];

  @Prop()
  NftTokenId: number;

  @Prop({ required: true })
  Faculty: string;

  @Prop({ required: true })
  Field: string;

  @Prop({ required: true })
  Subject: string;

  @Prop({ default: 0 })
  RoyaltyFee: number;

  @Prop({ default: 0 })
  DocumentFee: number;

  @Prop({ default: false })
  IsFree: boolean;

  @Prop({ default: 0 })
  MintCost: number;

  @Prop({ enum: ['public', 'private'], required: true })
  Network: string;

  @Prop({ default: 0 })
  Votes: number;

  @Prop({ default: 0 })
  TotalVotes: number;

  @Prop({
    type: [
      {
        VoterId: { type: Types.ObjectId, ref: 'User' },
        Type: { type: String, enum: ['upvote', 'downvote'] },
        Timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  VoteHistory: Array<{
    VoterId: Types.ObjectId;
    Type: string;
    Timestamp: Date;
  }>;

  @Prop({ type: [Number], default: [] })
  VoteMilestones: number[];

  @Prop({ default: 0 })
  Violations: number;

  @Prop({
    type: [
      {
        ReporterId: { type: Types.ObjectId, ref: 'User' },
        Reason: String,
        Status: { type: String, enum: ['pending', 'confirmed', 'rejected'] },
        Timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  Reports: Array<{
    ReporterId: Types.ObjectId;
    Reason: string;
    Status: string;
    Timestamp: Date;
  }>;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
