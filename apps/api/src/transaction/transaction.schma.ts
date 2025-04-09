import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, unique: true })
  transactionHash: string; // Hash giao dịch trên blockchain

  @Prop({ required: true })
  type: string; // 'BUY_DOCUMENT', 'REWARD_QUESTION', 'WITHDRAW_TOKEN', ...

  @Prop({ required: true })
  fromAddress: string;

  @Prop({ required: true })
  toAddress: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, refPath: 'onModel' })
  subjectId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['Document', 'Question', 'Answer', 'Student', 'Business', 'School'],
  })
  onModel: string; // Xác định collection liên quan

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ default: 'pending' })
  status: string; // 'pending', 'success', 'failed'
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
