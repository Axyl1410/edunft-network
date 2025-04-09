import { Types } from 'mongoose';
import { Enterprise } from 'src/enterprise/enterprise.schema';

export class HiringPost {
  /**
   * Reference to the enterprise that created this hiring post
   */
  enterprise: Types.ObjectId | Enterprise;

  /**
   * Web3 wallet address of the enterprise (for quick display)
   */
  enterpriseWeb3Address: string;

  /**
   * Title of the hiring post
   */
  title: string;

  /**
   * Detailed description of the job opening
   */
  description?: string;

  /**
   * List of requirements for the position
   */
  requirements: string[];

  /**
   * Creation timestamp (automatically managed by Mongoose)
   */
  createdAt?: Date;

  /**
   * Last update timestamp (automatically managed by Mongoose)
   */
  updatedAt?: Date;
}
