import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  WalletAddress: string;

  @Prop()
  Username?: string;

  @Prop()
  Bio?: string;

  @Prop()
  ProfilePicture?: string;

  @Prop()
  Banner?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
