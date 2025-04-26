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

  @Post()
  async addFile(@Body() createFileDto: CreateFileDto) {
    const result = await this.fileService.addFile(createFileDto);

    if (result.isSuccess()) {
      return result.value;
    } else {
      const error = result.error;
      if (error instanceof NotFoundFailure) {
        throw new NotFoundException(error.message);
      } else if (error instanceof DatabaseFailure) {
        throw new InternalServerErrorException('A database error occurred.');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  @Get('hash/:hash')
  async getFileByHash(@Param('hash') hash: string) {
    if (!hash) {
      throw new NotFoundException('Hash is required.');
    }

    const result = await this.fileService.getFileByHash(hash);

    if (result.isSuccess()) {
      return result.value;
    } else {
      const error = result.error;
      if (error instanceof NotFoundFailure) {
        throw new NotFoundException(error.message);
      } else if (error instanceof DatabaseFailure) {
        throw new InternalServerErrorException('A database error occurred.');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  @Get('user/:walletAddress')
  async getFilesByWalletAddress(@Param('walletAddress') walletAddress: string) {
    if (!walletAddress) {
      throw new NotFoundException('Wallet address is required.');
    }

    const result =
      await this.fileService.getFilesByWalletAddress(walletAddress);

    if (result.isSuccess()) {
      return result.value;
    } else {
      const error = result.error;
      if (error instanceof NotFoundFailure) {
        throw new NotFoundException(error.message);
      } else if (error instanceof DatabaseFailure) {
        throw new InternalServerErrorException('A database error occurred.');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  @Delete(':hash')
  async removeFile(@Param('hash') hash: string) {
    const result = await this.fileService.removeFile(hash);
    if (result.isSuccess()) {
      return result.value;
    } else {
      const error = result.error;
      if (error instanceof NotFoundFailure) {
        throw new NotFoundException(error.message);
      } else if (error instanceof DatabaseFailure) {
        throw new InternalServerErrorException('A database error occurred.');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  @Post('transfer')
  async transferFile(@Body() body: { hash: string; newWalletAddress: string }) {
    const { hash, newWalletAddress } = body;
    if (!hash || !newWalletAddress) {
      throw new NotFoundException('Hash and new wallet address are required.');
    }

    const result = await this.fileService.transferFile(hash, newWalletAddress);
    if (result.isSuccess()) {
      return result.value;
    } else {
      const error = result.error;
      if (error instanceof NotFoundFailure) {
        throw new NotFoundException(error.message);
      } else if (error instanceof DatabaseFailure) {
        throw new InternalServerErrorException('A database error occurred.');
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }
}
