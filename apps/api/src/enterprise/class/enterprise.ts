import { Types } from 'mongoose';

export class Enterprise {
  /**
   * Unique blockchain wallet address of the enterprise
   */
  web3Address: string;

  /**
   * Unique name of the enterprise
   */
  name: string;

  /**
   * Industry category the enterprise belongs to
   */
  industry?: string;

  /**
   * Descriptive information about the enterprise
   */
  description?: string;

  /**
   * List of hiring posts created by this enterprise
   */
  hiringPosts?: Types.ObjectId[];

  /**
   * Creation timestamp (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
