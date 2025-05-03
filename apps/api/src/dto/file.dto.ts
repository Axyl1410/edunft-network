import { Types } from 'mongoose';

export interface CreateFileDto {
  User: Types.ObjectId;
  Name: string;
  Description: string;
  IpfsHash?: string;
  MainImageIpfsHash?: string;
  SubImagesIpfsHashes?: string[];
  NftTokenId?: number;
  Hash?: string;
  RoyaltyFee: number;
  DocumentFee: number;
  IsFree: boolean;
  MintCost: number;
  Faculty: string;
  Field: string;
  Subject: string;
  Network: 'public' | 'private';
  Size: number;
  Mime_type: string;
}
