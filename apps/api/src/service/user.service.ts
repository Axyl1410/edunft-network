import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    user: User,
  ): Promise<Result<User, DatabaseFailure | ValidationFailure>> {
    if (!user.WalletAddress) {
      return new Fail(new ValidationFailure('User', user.WalletAddress));
    }

    try {
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();

      return new Success(savedUser);
    } catch {
      return new Fail(new DatabaseFailure('Failed to create new user.'));
    }
  }

  // login user when connecting wallet
  async loginUser(
    user: User,
  ): Promise<
    Result<User, NotFoundFailure | DatabaseFailure | ValidationFailure>
  > {
    if (!user.WalletAddress) {
      return new Fail(new ValidationFailure('User', user.WalletAddress));
    }

    try {
      const foundUser = await this.userModel
        .findOne({
          WalletAddress: user.WalletAddress,
        })
        .lean()
        .exec();

      if (foundUser) {
        return new Success(foundUser);
      }
      return new Fail(new NotFoundFailure('User', user.WalletAddress));
    } catch {
      return new Fail(new DatabaseFailure('Failed to login user.'));
    }
  }

  async getUserByWalletAddress(
    walletAddress: string,
  ): Promise<
    Result<User, NotFoundFailure | DatabaseFailure | ValidationFailure>
  > {
    if (!walletAddress) {
      return new Fail(new ValidationFailure('User', walletAddress));
    }

    try {
      const user = await this.userModel
        .findOne({ WalletAddress: walletAddress })
        .lean()
        .exec();

      if (!user) {
        return new Fail(new NotFoundFailure('User', walletAddress));
      }

      return new Success(user);
    } catch {
      return new Fail(
        new DatabaseFailure('Failed to fetch user by wallet address.'),
      );
    }
  }

  async getUserIdByWalletAddress(
    walletAddress: string,
  ): Promise<{ _id: string }> {
    try {
      const user = await this.userModel
        .findOne({
          WalletAddress: walletAddress,
        })
        .select('_id')
        .lean()
        .exec();

      if (!user) {
        throw new Error(`User with wallet address ${walletAddress} not found.`);
      }

      return { _id: user._id.toString() };
    } catch {
      throw new Error(`Failed to fetch user ID by wallet address: `);
    }
  }
}
