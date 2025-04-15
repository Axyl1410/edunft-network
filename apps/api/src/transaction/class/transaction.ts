import { Types } from 'mongoose';

/**
 * Types of transactions in the system
 */
export type TransactionType =
  | 'BUY_DOCUMENT'
  | 'REWARD_QUESTION'
  | 'WITHDRAW_TOKEN';

/**
 * Models that can be referenced in transactions
 */
export type TransactionModel =
  | 'Document'
  | 'Question'
  | 'Answer'
  | 'Student'
  | 'Business'
  | 'School';

/**
 * Transaction status options
 */
export type TransactionStatus = 'pending' | 'success' | 'failed';

export class Transaction {
  /**
   * Hash of the transaction on the blockchain
   */
  transactionHash: string;

  /**
   * Type of transaction
   */
  type: TransactionType;

  /**
   * Sender's wallet address
   */
  fromAddress: string;

  /**
   * Recipient's wallet address
   */
  toAddress: string;

  /**
   * Amount of tokens transferred
   */
  amount: number;

  /**
   * ID of the related entity (document, question, etc.)
   */
  subjectId?: Types.ObjectId;

  /**
   * Collection/model name for the referenced entity
   */
  onModel?: TransactionModel;

  /**
   * Timestamp of the transaction on blockchain
   */
  timestamp: Date;

  /**
   * Current status of the transaction
   */
  status: TransactionStatus;

  /**
   * Creation timestamp in the database (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
