import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from '../core/failure';
import { FileService } from '../service/file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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

  @Post()
  async addFile(
    @Body('walletAddress') walletAddress: string,
    @Body('hash') hash: string,
    @Body('name') name: string,
    @Body('size') size: number,
    @Body('mimeType') mimeType: string,
    @Body('network') network: 'public' | 'private',
    @Body('pinataId') pinataId: string,
  ) {
    const result = await this.fileService.addFile(
      walletAddress,
      hash,
      name,
      size,
      mimeType,
      network,
      pinataId,
    );
    return this.handleResult(result);
  }

  @Get('hash/:hash')
  async getFileByHash(@Param('hash') hash: string) {
    const result = await this.fileService.getFileByHash(hash);
    return this.handleResult(result);
  }

  @Get('user/:walletAddress')
  async getFilesByWalletAddress(@Param('walletAddress') walletAddress: string) {
    const result =
      await this.fileService.getFilesByWalletAddress(walletAddress);
    return this.handleResult(result);
  }

  @Delete(':hash')
  async removeFile(@Param('hash') hash: string) {
    const result = await this.fileService.removeFile(hash);
    return this.handleResult(result);
  }

  @Put('transfer')
  async transferFile(@Body() hash: string, @Body() newWalletAddress: string) {
    const result = await this.fileService.transferFile(hash, newWalletAddress);
    return this.handleResult(result);
  }
}
