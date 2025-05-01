import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { Collection } from 'src/schema/collection.schema';
import { CollectionService } from 'src/service/collection.service';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

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

  @Post(':walletAddress/owner')
  async addOwner(
    @Param('walletAddress') walletAddress: string,
    @Body('addressContract') addressContract: string,
  ): Promise<Collection> {
    const result = await this.collectionService.addOwner(
      walletAddress,
      addressContract,
    );
    return this.handleResult(result);
  }

  @Get('owners') async getAllOwners(): Promise<string[]> {
    const result = await this.collectionService.getAllOwners();
    return this.handleResult(result);
  }
}
