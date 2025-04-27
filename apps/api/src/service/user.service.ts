import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: User): Promise<Result<User, DatabaseFailure>> {
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
  ): Promise<Result<User, NotFoundFailure | DatabaseFailure>> {
    try {
      const foundUser = await this.userModel
        .findOne({
          WalletAddress: user.WalletAddress,
        })
        .exec();

      if (foundUser) {
        return new Success(foundUser);
      } else {
        return await this.createUser(user);
      }
    } catch {
      return new Fail(new DatabaseFailure('Failed to login user.'));
    }
  }

  async getUserByWalletAddress(
    walletAddress: string,
  ): Promise<Result<User, NotFoundFailure | DatabaseFailure>> {
    try {
      const user = await this.userModel
        .findOne({ WalletAddress: walletAddress })
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
}
