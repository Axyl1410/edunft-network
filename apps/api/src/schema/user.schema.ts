import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  WalletAddress: string;

  @Prop({ default: null })
  Username?: string;

  @Prop({ default: null })
  Bio?: string;

  @Prop({ default: null })
  ProfilePicture?: string;

  @Prop({ default: null })
  Banner?: string;

  @Prop({ default: 100 })
  reputation?: number;

  @Prop({ default: 0 })
  violations?: number;

  @Prop({ default: null })
  bannedUntil?: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
