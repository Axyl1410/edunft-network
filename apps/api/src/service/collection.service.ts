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
    if (!holder || !holder.address || !holder.tokenId || !walletAddress) {
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
          { user: user._id },
          { $addToSet: { holders: holder } },
          { new: true, upsert: true, runValidators: true },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(
          new DatabaseFailure('Failed to update or create collection.'),
        );
      }

      return new Success(updatedCollection);
    } catch (error) {
      console.error('Error adding holder:', error);
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
          { user: user._id },
          { $pull: { holders: { address: holderAddress, tokenId: tokenId } } },
          { new: true },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(new DatabaseFailure('Failed to update collection.'));
      }

      return new Success(updatedCollection);
    } catch (error) {
      console.error('Error removing holder:', error);
      return new Fail(
        new DatabaseFailure('Failed to remove holder due to a database error.'),
      );
    }
  }

  async addOwner(
    walletAddress: string,
    owner: OwnerItem,
  ): Promise<Result<Collection, DatabaseFailure | ValidationFailure>> {
    if (!owner || !owner.address || !owner.name || !walletAddress) {
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
          { user: user._id },
          { $addToSet: { owner: owner } },
          { new: true, upsert: true, runValidators: true },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(
          new DatabaseFailure('Failed to update or create collection.'),
        );
      }

      return new Success(updatedCollection);
    } catch (error) {
      console.error('Error adding owner:', error);
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
          { user: user._id },
          { $pull: { owner: { contract } } },
          { new: true },
        )
        .exec();

      if (!updatedCollection) {
        return new Fail(new DatabaseFailure('Failed to update collection.'));
      }

      return new Success(updatedCollection);
    } catch (error) {
      console.error('Error removing owner:', error);
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
        if (collection.owner && Array.isArray(collection.owner)) {
          collection.owner.forEach((owner) => allOwnersSet.add(owner));
        }
      }

      return new Success(Array.from(allOwnersSet));
    } catch (error) {
      console.error('Error retrieving all owners:', error);
      return new Fail(new DatabaseFailure('Failed to get owners.'));
    }
  }
}
