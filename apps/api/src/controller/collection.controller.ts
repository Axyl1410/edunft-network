import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import {
  Collection,
  HoldingItem,
  OwnerItem,
} from 'src/schema/collection.schema';
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

  @Post(':walletAddress/holders')
  async addHolder(
    @Param('walletAddress') walletAddress: string,
    @Body() holder: HoldingItem,
  ): Promise<Collection> {
    const result = await this.collectionService.addHolder(
      walletAddress,
      holder,
    );
    return this.handleResult(result);
  }

  @Delete(':walletAddress/holders')
  async removeHolder(
    @Param('walletAddress') walletAddress: string,
    @Body('Address') Address: string,
    @Body('TokenId') TokenId: string,
  ): Promise<Collection> {
    const result = await this.collectionService.removeHolder(
      walletAddress,
      Address,
      TokenId,
    );
    return this.handleResult(result);
  }

  @Post(':walletAddress/owners')
  async addOwner(
    @Param('walletAddress') walletAddress: string,
    @Body() owner: OwnerItem,
  ): Promise<Collection> {
    const result = await this.collectionService.addOwner(walletAddress, owner);
    return this.handleResult(result);
  }

  @Delete(':walletAddress/owners')
  async removeOwner(
    @Param('walletAddress') walletAddress: string,
    @Body('contract') contract: string,
  ): Promise<Collection> {
    const result = await this.collectionService.removeOwner(
      walletAddress,
      contract,
    );
    return this.handleResult(result);
  }

  @Get('owners')
  async getAllOwners(): Promise<OwnerItem[]> {
    const result = await this.collectionService.getAllOwners();
    return this.handleResult(result);
  }

  @Get(':walletAddress/owners')
  async getOwnersByWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<OwnerItem[]> {
    const result =
      await this.collectionService.getOwnersByWalletAddress(walletAddress);
    return this.handleResult(result);
  }

  @Get(':walletAddress/collection')
  async getCollectionByWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<{ holders: HoldingItem[]; owner: OwnerItem[] }> {
    const result =
      await this.collectionService.getCollectionByWalletAddress(walletAddress);
    return this.handleResult(result);
  }
}
