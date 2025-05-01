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
        .findOne({ WalletAddress: walletAddress })
        .select('_id')
        .lean()
        .exec();

      if (!user) {
        return new Fail(
          new DatabaseFailure(
            `User with wallet address ${walletAddress} not found.`,
          ),
        );
      }

      const updatedCollection = await this.collectionModel
        .findOneAndUpdate(
          { User: user._id },
          {
            $addToSet: { Owner: addressContract },
            $setOnInsert: { User: user._id },
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(
          new DatabaseFailure('Failed to update or create collection.'),
        );
      }

      return new Success(updatedCollection);
    } catch {
      return new Fail(
        new DatabaseFailure('Failed to add owner due to a database error.'),
      );
    }
  }

  async getAllOwners(): Promise<Result<string[], DatabaseFailure>> {
    try {
      const allCollections = await this.collectionModel.find().lean().exec();
      const allOwnersSet = new Set<string>();

      for (const collection of allCollections) {
        if (collection.Owner && Array.isArray(collection.Owner)) {
          collection.Owner.forEach((owner) => allOwnersSet.add(owner));
        }
      }

      return new Success(Array.from(allOwnersSet));
    } catch {
      return new Fail(new DatabaseFailure('Failed to get owners.'));
    }
  }
}
