import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { File } from 'src/schema/file.schema';
import { UserService } from './user.service';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<File>,
    private readonly userService: UserService,
  ) {}

  async addFile(
    fileData: File,
  ): Promise<Result<File, DatabaseFailure | ValidationFailure>> {
    if (!fileData) {
      return new Fail(new ValidationFailure('File', fileData));
    }

    try {
      const newFile = new this.fileModel(fileData);
      const saveFile = await newFile.save();

      return new Success(saveFile);
    } catch {
      return new Fail(new DatabaseFailure('Failed to create new file.'));
    }
  }

  async getFileByHash(
    hash: string,
  ): Promise<Result<File, DatabaseFailure | ValidationFailure>> {
    if (!hash) {
      return new Fail(new ValidationFailure('File', hash));
    }

    try {
      const file = await this.fileModel.findOne({ Hash: hash }).lean().exec();

      if (!file) {
        return new Fail(new NotFoundFailure('File not found'));
      }

      return new Success(file);
    } catch {
      return new Fail(new DatabaseFailure('Failed to retrieve file.'));
    }
  }

  async getFilesByWalletAddress(
    walletAddress: string,
  ): Promise<
    Result<File[], DatabaseFailure | NotFoundFailure | ValidationFailure>
  > {
    if (!walletAddress) {
      return new Fail(new ValidationFailure('Wallet Address', walletAddress));
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(walletAddress);

      if (!user) {
        return new Fail(new NotFoundFailure('User not found'));
      }

      const files = await this.fileModel.find({ User: user._id }).lean().exec();

      return new Success(files);
    } catch {
      return new Fail(new DatabaseFailure('Failed to retrieve files.'));
    }
  }

  async removeFile(
    hash: string,
  ): Promise<Result<File, DatabaseFailure | ValidationFailure>> {
    if (!hash) {
      return new Fail(new ValidationFailure('File', hash));
    }

    try {
      const file = await this.fileModel.findOneAndDelete({ Hash: hash }).exec();

      if (!file) {
        return new Fail(new NotFoundFailure('File not found'));
      }

      return new Success(file);
    } catch {
      return new Fail(new DatabaseFailure('Failed to remove file.'));
    }
  }

  async transferFile(
    hash: string,
    newWalletAddress: string,
  ): Promise<Result<File, DatabaseFailure | ValidationFailure>> {
    if (!hash || !newWalletAddress) {
      return new Fail(new ValidationFailure('Hash or Wallet Address', hash));
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(newWalletAddress);

      if (!user) {
        return new Fail(new NotFoundFailure('User not found'));
      }

      const file = await this.fileModel.findOne({ Hash: hash }).lean().exec();

      if (!file) {
        return new Fail(new NotFoundFailure('File not found'));
      }

      const updatedFile = await this.fileModel.findOneAndUpdate(
        { Hash: hash },
        { User: user._id },
        { new: true },
      );

      if (!updatedFile) {
        return new Fail(
          new DatabaseFailure('Failed to update file after transfer.'),
        );
      }

      return new Success(updatedFile);
    } catch {
      return new Fail(new DatabaseFailure('Failed to transfer file.'));
    }
  }
}
