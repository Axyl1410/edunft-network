import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true, type: String })
  walletAddress: string;

  @Prop({ default: null, type: String })
  username?: string;

  @Prop({ default: null, type: String })
  bio?: string;

  @Prop({ default: null, type: String })
  profilePicture?: string;

  @Prop({ default: null, type: String })
  banner?: string;

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
