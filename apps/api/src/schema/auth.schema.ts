import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Prop({ default: UserStatus.PENDING })
  status: UserStatus;

  @Prop()
  approvedBy?: string;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectionReason?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
