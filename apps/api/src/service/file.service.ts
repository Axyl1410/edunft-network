import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseFailure } from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { CreateFileDto } from 'src/dto/file.dto';
import { File } from 'src/schema/file.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<File>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addFile(
    fileData: CreateFileDto,
  ): Promise<Result<File, DatabaseFailure>> {
    try {
      const newFile = new this.fileModel(fileData);
      const saveFile = await newFile.save();

      return new Success(saveFile);
    } catch {
      return new Fail(new DatabaseFailure('Failed to create new file.'));
    }
  }

  async getFileByHash(hash: string): Promise<Result<File, DatabaseFailure>> {
    try {
      const file = await this.fileModel.findOne({ Hash: hash }).exec();

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
  ): Promise<Result<File[], DatabaseFailure>> {
    try {
      const user = await this.userModel
        .findOne({
          WalletAddress: walletAddress,
        })
        .select('User')
        .exec();

      if (!user) {
        return new Fail(new DatabaseFailure('User not found'));
      }

      const files = await this.fileModel
        .find({ User: user._id.toString() })
        .exec();

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
        .select('User')
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
