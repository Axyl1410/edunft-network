import { Types } from 'mongoose';

export class School {
  /**
   * Unique blockchain address associated with the school
   */
  web3Address: string;

  /**
   * Unique name of the school
   */
  name: string;

  /**
   * Physical address of the school (optional)
   */
  address?: string;

  /**
   * The blockchain contract address used for verification (optional)
   */
  verificationContractAddress?: string;

  /**
   * List of student IDs associated with this school
   */
  students?: Types.ObjectId[];

  /**
   * Creation timestamp (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
