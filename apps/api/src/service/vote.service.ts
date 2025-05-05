import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { Vote, VoteDocument } from 'src/schema/vote.schema';
import { FileService } from './file.service';
import { UserService } from './user.service';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name) private readonly voteModel: Model<VoteDocument>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  async handleVote(
    walletAddress: string,
    voteType: 'upvote' | 'downvote',
    hash: string,
  ): Promise<
    Result<Vote, DatabaseFailure | ValidationFailure | NotFoundFailure>
  > {
    if (!walletAddress || !voteType || !hash) {
      return new Fail(
        new ValidationFailure(
          'Wallet Address, Vote Type or Hash',
          walletAddress,
        ),
      );
    }

    try {
      const fileid = await this.fileService.getFileIdbyHash(hash);
      if (!fileid) {
        return new Fail(new NotFoundFailure('File', hash));
      }

      const userid =
        await this.userService.getUserIdByWalletAddress(walletAddress);
      if (!userid) {
        return new Fail(new NotFoundFailure('User', walletAddress));
      }

      // Check if the user has already voted
      const existingVote = await this.voteModel
        .findOne({
          User: userid._id,
          File: fileid._id,
        })
        .lean()
        .exec();

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // If voted the same type, remove the vote
          const deletedVote = await this.voteModel.findByIdAndDelete(
            existingVote._id,
          );
          if (!deletedVote) {
            return new Fail(new DatabaseFailure('Failed to delete vote.'));
          }
          return new Success(deletedVote);
        } else {
          // If voted a different type, update the vote
          existingVote.voteType = voteType;
          const updatedVote = await existingVote.save();
          if (!updatedVote) {
            return new Fail(new DatabaseFailure('Failed to update vote.'));
          }
          return new Success(updatedVote);
        }
      } else {
        // If not voted yet, create a new vote
        const newVote = await new this.voteModel({
          User: userid._id,
          File: fileid._id,
          voteType: voteType,
        }).save();

        if (!newVote) {
          return new Fail(new DatabaseFailure('Failed to save vote.'));
        }
        return new Success(newVote);
      }
    } catch {
      return new Fail(new DatabaseFailure('Failed to handle vote.'));
    }
  }
}
