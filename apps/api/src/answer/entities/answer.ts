import { Types } from 'mongoose';
import { Question } from 'src/question/question.schema';
import { Student } from 'src/students/students.schema';

export class Answer {
  /**
   * Reference to the question this answer belongs to
   */
  question: Types.ObjectId | Question;

  /**
   * Reference to the student who provided this answer
   */
  answerer: Types.ObjectId | Student;

  /**
   * Web3 wallet address of the answerer (for quick display)
   */
  answererWeb3Address: string;

  /**
   * Content of the answer
   */
  content: string;

  /**
   * Indicates if this answer has been marked as correct
   */
  isCorrect: boolean;

  /**
   * Indicates if the reward for this answer has been claimed
   */
  rewardClaimed: boolean;

  /**
   * Creation timestamp (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
