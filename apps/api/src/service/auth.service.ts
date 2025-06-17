import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from '../core/failure';
import { Fail, Result, Success } from '../core/types';
import { Auth, UserRole, UserStatus } from '../schema/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
  ) {}

  async register(
    walletAddress: string,
    username: string,
    email: string,
  ): Promise<Result<Auth, DatabaseFailure | ValidationFailure>> {
    if (!walletAddress || !username || !email) {
      return new Fail(new ValidationFailure('Registration data'));
    }

    try {
      const existingUser = await this.authModel.findOne({
        $or: [{ walletAddress }, { email }],
      });

      if (existingUser) {
        return new Fail(new ValidationFailure('User already exists'));
      }

      const newUser = new this.authModel({
        walletAddress,
        username,
        email,
        role: UserRole.USER,
        status: UserStatus.PENDING,
      });

      const savedUser = await newUser.save();
      return new Success(savedUser);
    } catch (error) {
      console.error('Error registering user:', error);
      return new Fail(new DatabaseFailure('Failed to register user'));
    }
  }

  async login(
    walletAddress: string,
  ): Promise<
    Result<Auth, DatabaseFailure | ValidationFailure | NotFoundFailure>
  > {
    if (!walletAddress) {
      return new Fail(new ValidationFailure('Wallet address'));
    }

    try {
      const user = await this.authModel.findOne({ walletAddress }).lean();

      if (!user) {
        return new Fail(new NotFoundFailure('User not found'));
      }

      if (user.status !== UserStatus.APPROVED) {
        return new Fail(new ValidationFailure('User not approved'));
      }

      return new Success(user);
    } catch (error) {
      console.error('Error logging in:', error);
      return new Fail(new DatabaseFailure('Failed to login'));
    }
  }

  async getPendingUsers(): Promise<Result<Auth[], DatabaseFailure>> {
    try {
      const pendingUsers = await this.authModel
        .find({ status: UserStatus.PENDING })
        .lean();
      return new Success(pendingUsers);
    } catch (error) {
      console.error('Error getting pending users:', error);
      return new Fail(new DatabaseFailure('Failed to get pending users'));
    }
  }

  async approveUser(
    adminWalletAddress: string,
    userWalletAddress: string,
  ): Promise<
    Result<Auth, DatabaseFailure | ValidationFailure | NotFoundFailure>
  > {
    try {
      const admin = await this.authModel.findOne({
        walletAddress: adminWalletAddress,
        role: UserRole.ADMIN,
      });

      if (!admin) {
        return new Fail(
          new ValidationFailure('Admin not found or unauthorized'),
        );
      }

      const user = await this.authModel.findOne({
        walletAddress: userWalletAddress,
      });

      if (!user) {
        return new Fail(new NotFoundFailure('User not found'));
      }

      user.status = UserStatus.APPROVED;
      user.approvedBy = adminWalletAddress;
      user.approvedAt = new Date();

      const updatedUser = await user.save();
      return new Success(updatedUser);
    } catch (error) {
      console.error('Error approving user:', error);
      return new Fail(new DatabaseFailure('Failed to approve user'));
    }
  }

  async rejectUser(
    adminWalletAddress: string,
    userWalletAddress: string,
    reason: string,
  ): Promise<
    Result<Auth, DatabaseFailure | ValidationFailure | NotFoundFailure>
  > {
    try {
      const admin = await this.authModel.findOne({
        walletAddress: adminWalletAddress,
        role: UserRole.ADMIN,
      });

      if (!admin) {
        return new Fail(
          new ValidationFailure('Admin not found or unauthorized'),
        );
      }

      const user = await this.authModel.findOne({
        walletAddress: userWalletAddress,
      });

      if (!user) {
        return new Fail(new NotFoundFailure('User not found'));
      }

      user.status = UserStatus.REJECTED;
      user.rejectionReason = reason;

      const updatedUser = await user.save();
      return new Success(updatedUser);
    } catch (error) {
      console.error('Error rejecting user:', error);
      return new Fail(new DatabaseFailure('Failed to reject user'));
    }
  }

  async isAdmin(walletAddress: string): Promise<boolean> {
    try {
      const user = await this.authModel.findOne({
        walletAddress,
        role: UserRole.ADMIN,
      });
      return !!user;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}
