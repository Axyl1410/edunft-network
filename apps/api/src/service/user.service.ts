import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // create a new user
  async createUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  // login user when connecting wallet
  async loginUser(user: User): Promise<User | null> {
    const foundUser = await this.userModel.findOne({
      WalletAddress: user.WalletAddress,
    });

    if (foundUser) {
      return foundUser;
    } else {
      const createdUser = await this.createUser(user);
      return createdUser;
    }
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    const user = await this.userModel.findOne({ WalletAddress: walletAddress });
    return user;
  }
}
