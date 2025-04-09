import { Types } from 'mongoose';
import { Students } from 'src/students/entities/students';

export class Question {
  /**
   * Reference to the student who asked the question
   */
  student: Types.ObjectId | Students;

  /**
   * Web3 wallet address of the student (for quick display)
   */
  studentWeb3Address: string;

  /**
   * Title of the question
   */
  title: string;

  /**
   * Content/body of the question
   */
  content: string;

  /**
   * Token reward offered for answering this question
   */
  rewardToken: number;

  /**
   * List of answers to this question
   */
  answers?: Types.ObjectId[];

  /**
   * Creation timestamp (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
