/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { File } from 'src/schema/file.schema';
import { User } from 'src/schema/user.schema';
import { createHash } from 'crypto';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<File>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private async checkDuplicate(hash: string): Promise<boolean> {
    const existingFile = await this.fileModel
      .findOne({ Hash: hash })
      .lean()
      .exec();
    return !!existingFile;
  }

  private async uploadToPinata(
    file: Buffer,
    filename: string,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, { filename });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const response = await axios.post<{ IpfsHash: string }>(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const ipfsHash = response.data?.IpfsHash;
      if (!ipfsHash) {
        throw new Error('IPFS hash not received from Pinata');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ipfsHash;
    } catch (error: any) {
      const errMsg =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error?.response?.data?.error || error?.message || 'Unknown error';
      throw new Error(`Pinata upload failed: ${errMsg}`);
    }
  }

  async addFile(
    fileData: CreateFileDto,
    mainFile: Buffer,
    mainImage: Buffer,
    subImages: Buffer[],
  ): Promise<Result<File, DatabaseFailure>> {
    try {
      // Generate file hash
      const fileHash = createHash('sha256').update(mainFile).digest('hex');

      // Check for duplicates
      const isDuplicate = await this.checkDuplicate(fileHash);
      if (isDuplicate) {
        return new Fail(new DatabaseFailure('Duplicate file detected'));
      }

      // Upload files to IPFS via Pinata
      const ipfsHash = await this.uploadToPinata(mainFile, 'mainFile');
      const mainImageIpfsHash = await this.uploadToPinata(
        mainImage,
        'mainImage',
      );

      const subImagesIpfsHashes = await Promise.all(
        subImages.map((img, index) =>
          this.uploadToPinata(img, `subImage${index}`),
        ),
      );

      // Create new file record
      const newFile = new this.fileModel({
        ...fileData,
        Hash: fileHash,
        IpfsHash: ipfsHash,
        MainImageIpfsHash: mainImageIpfsHash,
        SubImagesIpfsHashes: subImagesIpfsHashes,
      });

      const savedFile = await newFile.save();
      return new Success(savedFile);
    } catch (error) {
      return new Fail(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        new DatabaseFailure('Failed to create new file: ' + error.message),
      );
    }
  }

  async getFileByHash(hash: string): Promise<Result<File, DatabaseFailure>> {
    try {
      const file = await this.fileModel.findOne({ Hash: hash }).lean().exec();

      if (!file) {
        return new Fail(new DatabaseFailure('File not found'));
      }

      return new Success(file);
    } catch {
      return new Fail(new DatabaseFailure('Failed to retrieve file.'));
    }
  }

  async getFilesByWalletAddress(
    walletAddress: string,
  ): Promise<Result<File[], DatabaseFailure | NotFoundFailure>> {
    try {
      const user = await this.userModel
        .findOne({
          WalletAddress: walletAddress,
        })
        .select('_id')
        .lean()
        .exec();

      if (!user) {
        return new Fail(new DatabaseFailure('User not found'));
      }

      const files = await this.fileModel
        .find({ User: user._id.toString() })
        .lean()
        .exec();

      if (!files || files.length === 0) {
        return new Fail(new NotFoundFailure('File', walletAddress));
      }
      return new Success(files);
    } catch {
      return new Fail(new DatabaseFailure('Failed to retrieve files.'));
    }
  }

  async removeFile(hash: string): Promise<Result<File, DatabaseFailure>> {
    try {
      const file = await this.fileModel.findOneAndDelete({ Hash: hash }).exec();

      if (!file) {
        return new Fail(new DatabaseFailure('File not found'));
      }
      return new Success(file);
    } catch {
      return new Fail(new DatabaseFailure('Failed to remove file.'));
    }
  }

  async transferFile(
    hash: string,
    newWalletAddress: string,
  ): Promise<Result<File, DatabaseFailure>> {
    try {
      const file = await this.fileModel.findOne({ Hash: hash }).exec();

      if (!file) {
        return new Fail(new DatabaseFailure('File not found'));
      }

      const user = await this.userModel
        .findOne({
          WalletAddress: newWalletAddress,
        })
        .select('_id')
        .lean()
        .exec();

      if (!user) {
        return new Fail(new DatabaseFailure('User not found'));
      }

      file.User = user._id;
      const updatedFile = await file.save();

      return new Success(updatedFile);
    } catch {
      return new Fail(new DatabaseFailure('Failed to transfer file.'));
    }
  }
}
