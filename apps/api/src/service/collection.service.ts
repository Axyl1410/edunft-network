import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseFailure } from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { Collection, CollectionDocument } from 'src/schema/collection.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addOwner(
    walletAddress: string,
    addressContract: string,
  ): Promise<Result<Collection, DatabaseFailure>> {
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

      let collection = await this.collectionModel
        .findOne({ User: user._id })
        .exec();

      if (!collection) {
        collection = new this.collectionModel({
          User: user._id,
          Owner: [addressContract],
        });

        await collection.save();
        return new Success(collection);
      }

      const file = await this.collectionModel
        .findOneAndUpdate(
          { User: user._id },
          { $addToSet: { Owner: addressContract } },
          { new: true },
        )
        .exec();

      if (!file) {
        return new Fail(new DatabaseFailure('Failed to add owner'));
      }

      return new Success(file);
    } catch {
      return new Fail(new DatabaseFailure('Failed to add owner.'));
    }
  }
}
