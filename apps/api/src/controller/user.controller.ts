import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { User } from 'src/schema/user.schema';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async getUser(
    @Body('WalletAddress') WalletAddress: string,
  ): Promise<User | null> {
    if (!WalletAddress) {
      throw new BadRequestException('WalletAddress is required');
    }

    try {
      const user = await this.userService.loginUser({ WalletAddress });
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':wallet')
  async getUserByWalletAddress(
    @Param('wallet') WalletAddress: string,
  ): Promise<User | null> {
    if (!WalletAddress) {
      throw new BadRequestException('WalletAddress is required');
    }

    try {
      const user = await this.userService.getUserByWalletAddress(WalletAddress);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
