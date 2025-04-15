import { Types } from 'mongoose';
import { Students } from 'src/students/class/students';

export class Documents {
  /**
   * Reference to the student who owns this document
   */
  owner: Types.ObjectId | Students;

  /**
   * Web3 wallet address of the document owner (for quick display)
   */
  ownerWeb3Address: string;

  /**
   * Title of the document
   */
  title: string;

  /**
   * Optional description of the document
   */
  description?: string;

  /**
   * Hash of the document file stored on IPFS or similar
   */
  fileHash: string;

  /**
   * Price of the document in
   */
}
