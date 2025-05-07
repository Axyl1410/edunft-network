import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true, type: String })
  WalletAddress: string;

  @Prop({ default: null, type: String })
  Username?: string;

  @Prop({ default: null, type: String })
  Bio?: string;

  @Prop({ default: null, type: String })
  ProfilePicture?: string;

  @Prop({ default: null, type: String })
  Banner?: string;

  @Prop({ default: 100, type: Number })
  reputation?: number;

  @Prop({ default: 0, type: Number })
  violations?: number;

  @Prop({ default: null, type: Date })
  bannedUntil?: Date;

  @Prop({
    type: String,
    enum: ['student', 'admin', 'teacher'],
    default: 'student',
  })
  role?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
