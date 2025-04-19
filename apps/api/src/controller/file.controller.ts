import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FileCID } from '../schema/file-cid.schema';
import { FileService } from '../service/file.service';
import { CreateItemDto, TransferFileCIDDto } from 'src/dto/file.dto';

@Controller('file-cid')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('create')
  async createFileCID(
    @Body('ownerAddress') ownerAddress: string,
  ): Promise<FileCID> {
    if (!ownerAddress) {
      throw new BadRequestException('ownerAddress is required.');
    }

    return this.fileService.create(ownerAddress);
  }

  @Put(':ownerAddress/add-item')
  async addItemToFileCID(
    @Param('ownerAddress') ownerAddress: string,
    @Body() createItemDto: CreateItemDto,
  ): Promise<FileCID> {
    if (!createItemDto.itemId) {
      throw new BadRequestException('itemId is required.');
    }

    return this.fileService.addItemToFileCID(ownerAddress, createItemDto);
  }

  @Put(':ownerAddress/mark-item-nft/:itemId')
  async markItemAsNFT(
    @Param('ownerAddress') ownerAddress: string,
    @Param('itemId') itemId: string,
  ): Promise<FileCID> {
    if (!itemId) {
      throw new BadRequestException('itemId is required.');
    }

    return this.fileService.markItemAsNFT(ownerAddress, itemId);
  }

  @Put(':ownerAddress/transfer')
  async transferFileCID(
    @Param('ownerAddress') ownerAddress: string,
    @Body() transferDto: TransferFileCIDDto,
  ): Promise<FileCID> {
    const { newOwnerAddress } = transferDto;
    if (!newOwnerAddress) {
      throw new BadRequestException('newOwnerAddress is required.');
    }

    return this.fileService.transferFileCID(ownerAddress, newOwnerAddress);
  }

  @Get(':ownerAddress')
  async getFileCID(
    @Param('ownerAddress') ownerAddress: string,
  ): Promise<{ address: string; items: any[] } | null> {
    const fileCIDDetails =
      await this.fileService.findOneByOwnerAddress(ownerAddress);
    if (!fileCIDDetails) {
      throw new NotFoundException(
        `FileCID for owner "${ownerAddress}" not found.`,
      );
    }
    // Only return address and items
    return {
      address: fileCIDDetails.address,
      items: fileCIDDetails.items,
    };
  }
}
