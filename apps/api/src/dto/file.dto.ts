import { Types } from 'mongoose';

export class CreateFileDto {
  User: Types.ObjectId;
  Hash: string;
  Name?: string;
  Size?: number;
  Created_at?: string;
  Mime_type?: string;
  network: 'public' | 'private';
}
