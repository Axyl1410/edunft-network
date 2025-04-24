import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { NotFoundFailure, DatabaseFailure } from 'src/core/failure';
import { User } from 'src/schema/user.schema';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async getUser(@Body('WalletAddress') WalletAddress: string): Promise<User> {
    if (!WalletAddress) {
      throw new NotFoundException('Wallet address is required.');
    }

    const result = await this.userService.loginUser({
      WalletAddress: WalletAddress,
    });

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

  @Get(':WalletAddress')
  async getUserByWalletAddress(
    @Param('WalletAddress') WalletAddress: string,
  ): Promise<User> {
    if (!WalletAddress) {
      throw new NotFoundException('Wallet address is required.');
    }

    const result = await this.userService.getUserByWalletAddress(WalletAddress);

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
