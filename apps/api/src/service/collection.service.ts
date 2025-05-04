import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseFailure, ValidationFailure } from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import {
  Collection,
  CollectionDocument,
  HoldingItem,
  OwnerItem,
} from 'src/schema/collection.schema';
import { UserService } from './user.service';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,
    private readonly userService: UserService,
  ) {}

  async addHolder(
    walletAddress: string,
    holder: HoldingItem,
  ): Promise<Result<Collection, DatabaseFailure | ValidationFailure>> {
    if (!holder || !holder.Address || !holder.TokenId || !walletAddress) {
      return new Fail(
        new ValidationFailure('Holder data is invalid or incomplete.'),
      );
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(walletAddress);

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
          { $addToSet: { Holders: holder } },
          { new: true, upsert: true, runValidators: true },
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
        new DatabaseFailure('Failed to add holder due to a database error.'),
      );
    }
  }

  async removeHolder(
    walletAddress: string,
    holderAddress: string,
    tokenId: string,
  ): Promise<Result<Collection, DatabaseFailure | ValidationFailure>> {
    if (!holderAddress || !tokenId || !walletAddress) {
      return new Fail(
        new ValidationFailure('Holder data is invalid or incomplete.'),
      );
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(walletAddress);

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
          { $pull: { Holders: { Address: holderAddress, TokenId: tokenId } } },
          { new: true },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(new DatabaseFailure('Failed to update collection.'));
      }

      return new Success(updatedCollection);
    } catch {
      return new Fail(
        new DatabaseFailure('Failed to remove holder due to a database error.'),
      );
    }
  }

  async addOwner(
    walletAddress: string,
    owner: OwnerItem,
  ): Promise<Result<Collection, DatabaseFailure | ValidationFailure>> {
    if (!owner || !owner.Address || !owner.name || !walletAddress) {
      return new Fail(
        new ValidationFailure('Owner data is invalid or incomplete.'),
      );
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(walletAddress);

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
          { $addToSet: { Owner: owner } },
          { new: true, upsert: true, runValidators: true },
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

  async removeOwner(
    walletAddress: string,
    contract: string,
  ): Promise<Result<Collection, DatabaseFailure | ValidationFailure>> {
    if (!contract || !walletAddress) {
      return new Fail(
        new ValidationFailure('Owner data is invalid or incomplete.'),
      );
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(walletAddress);

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
          { $pull: { Owner: { contract } } },
          { new: true },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(new DatabaseFailure('Failed to update collection.'));
      }

      return new Success(updatedCollection);
    } catch {
      return new Fail(
        new DatabaseFailure('Failed to remove owner due to a database error.'),
      );
    }
  }

  async getAllOwners(): Promise<Result<OwnerItem[], DatabaseFailure>> {
    try {
      const allCollections = await this.collectionModel.find().lean().exec();
      const allOwnersSet = new Set<OwnerItem>();

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
