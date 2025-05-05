import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { VoteService } from 'src/service/vote.service';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  private handleResult<T>(result: {
    isSuccess: () => boolean;
    value?: T;
    error?: any;
  }): T {
    if (result.isSuccess()) {
      return result.value as T;
    }
    this.handleError(result.error);
  }

  private handleError(error: any): never {
    if (error instanceof NotFoundFailure) {
      throw new NotFoundException(error.message);
    } else if (error instanceof DatabaseFailure) {
      throw new InternalServerErrorException('A database error occurred.');
    } else {
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Post('addVote')
  async addVote(
    @Body('walletAddress') walletAddress: string,
    @Body('voteType') voteType: 'upvote' | 'downvote',
    @Body('hash') hash: string,
  ): Promise<void> {
    const result = await this.voteService.handleVote(
      walletAddress,
      voteType,
      hash,
    );
    this.handleResult(result);
  }
}
