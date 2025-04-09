import { Types } from 'mongoose';
import { School } from '../../school/entities/school';

export class Students {
  /**
   * Web3 wallet address (primary identifier)
   */
  web3Address: string;

  /**
   * Student's full name
   */
  fullName: string;

  /**
   * Student's date of birth
   */
  dateOfBirth?: Date;

  /**
   * Reference to the student's school
   */
  school?: Types.ObjectId | School;

  /**
   * Student's grade level
   */
  grade?: string;

  /**
   * Student's major or field of study
   */
  major?: string;

  /**
   * Hash of the verified transcript
   */
  transcriptHash?: string;

  /**
   * Student's token balance
   */
  tokenBalance: number;

  /**
   * List of documents the student has for sale
   */
  documentsForSale?: Types.ObjectId[];

  /**
   * List of questions asked by the student
   */
  questionsAsked?: Types.ObjectId[];

  /**
   * List of answers provided by the student
   */
  answersGiven?: Types.ObjectId[];

  /**
   * Creation timestamp (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
