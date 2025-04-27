import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { FileService } from '../service/file.service';
import { DatabaseFailure, NotFoundFailure } from '../core/failure';
import { CreateFileDto } from 'src/dto/file.dto';

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
  async addFile(@Body() createFileDto: CreateFileDto) {
    const result = await this.fileService.addFile(createFileDto);
    return this.handleResult(result);
  }

  @Get('hash/:hash')
  async getFileByHash(@Param('hash') hash: string) {
    if (!hash) {
      throw new NotFoundException('Hash is required.');
    }
    const result = await this.fileService.getFileByHash(hash);
    return this.handleResult(result);
  }

  @Get('user/:walletAddress')
  async getFilesByWalletAddress(@Param('walletAddress') walletAddress: string) {
    if (!walletAddress) {
      throw new NotFoundException('Wallet address is required.');
    }
    const result =
      await this.fileService.getFilesByWalletAddress(walletAddress);
    return this.handleResult(result);
  }

  @Delete(':hash')
  async removeFile(@Param('hash') hash: string) {
    const result = await this.fileService.removeFile(hash);
    return this.handleResult(result);
  }

  @Post('transfer')
  async transferFile(@Body() body: { hash: string; newWalletAddress: string }) {
    const { hash, newWalletAddress } = body;
    if (!hash || !newWalletAddress) {
      throw new NotFoundException('Hash and new wallet address are required.');
    }
    const result = await this.fileService.transferFile(hash, newWalletAddress);
    return this.handleResult(result);
  }
}
