import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from '../core/failure';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleResult<T>(result: {
    isSuccess: () => boolean;
    value?: T;
    error?: any;
  }): T {
    if (result.isSuccess()) {
      return result.value;
    }
    this.handleError(result.error);
  }

  private handleError(error: any): never {
    if (error instanceof NotFoundFailure) {
      throw new NotFoundException(error.message);
    } else if (error instanceof ValidationFailure) {
      throw new UnauthorizedException(error.message);
    } else if (error instanceof DatabaseFailure) {
      throw new InternalServerErrorException('A database error occurred.');
    } else {
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Post('register')
  async register(
    @Body('walletAddress') walletAddress: string,
    @Body('username') username: string,
    @Body('email') email: string,
  ) {
    const result = await this.authService.register(
      walletAddress,
      username,
      email,
    );
    return this.handleResult(result);
  }

  @Post('login')
  async login(@Body('walletAddress') walletAddress: string) {
    const result = await this.authService.login(walletAddress);
    return this.handleResult(result);
  }

  @Get('admin/pending-users')
  async getPendingUsers(
    @Body('adminWalletAddress') adminWalletAddress: string,
  ) {
    const isAdmin = await this.authService.isAdmin(adminWalletAddress);
    if (!isAdmin) {
      throw new UnauthorizedException('Only admins can access this endpoint');
    }

    const result = await this.authService.getPendingUsers();
    return this.handleResult(result);
  }

  @Put('admin/approve')
  async approveUser(
    @Body('adminWalletAddress') adminWalletAddress: string,
    @Body('userWalletAddress') userWalletAddress: string,
  ) {
    const isAdmin = await this.authService.isAdmin(adminWalletAddress);
    if (!isAdmin) {
      throw new UnauthorizedException('Only admins can approve users');
    }

    const result = await this.authService.approveUser(
      adminWalletAddress,
      userWalletAddress,
    );
    return this.handleResult(result);
  }

  @Put('admin/reject')
  async rejectUser(
    @Body('adminWalletAddress') adminWalletAddress: string,
    @Body('userWalletAddress') userWalletAddress: string,
    @Body('reason') reason: string,
  ) {
    const isAdmin = await this.authService.isAdmin(adminWalletAddress);
    if (!isAdmin) {
      throw new UnauthorizedException('Only admins can reject users');
    }

    const result = await this.authService.rejectUser(
      adminWalletAddress,
      userWalletAddress,
      reason,
    );
    return this.handleResult(result);
  }
}
