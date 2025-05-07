import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { User } from 'src/schema/user.schema';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Post('login')
  async getUser(@Body('WalletAddress') WalletAddress: string): Promise<User> {
    const result = await this.userService.loginUser({
      WalletAddress: WalletAddress,
    });

    return this.handleResult(result);
  }

  @Get(':WalletAddress')
  async getUserByWalletAddress(
    @Param('WalletAddress') WalletAddress: string,
  ): Promise<User> {
    const result = await this.userService.getUserByWalletAddress(WalletAddress);
    return this.handleResult(result);
  }

  @Post('create')
  async createUser(@Body() user: User): Promise<User> {
    const result = await this.userService.createUser(user);
    return this.handleResult(result);
  }

  @Put(':WalletAddress')
  async updateUser(
    @Param('WalletAddress') WalletAddress: string,
    @Body() update: Partial<User>
  ): Promise<User> {
    const result = await this.userService.updateUser(WalletAddress, update);
    return this.handleResult(result);
  }
}
