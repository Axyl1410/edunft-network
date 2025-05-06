import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { Report } from 'src/schema/report.schema';
import { ReportService } from 'src/service/report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

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

  @Post('create')
  async createReport(
    @Body('walletAddress') walletAddress: string,
    @Body('hash') hash: string,
    @Body('reason') reason: string,
    @Body('description') description: string,
  ): Promise<Report> {
    const result = await this.reportService.createReport(
      walletAddress,
      hash,
      reason,
      description,
    );

    return this.handleResult(result);
  }

  @Delete(':id')
  async deleteReport(@Param('id') reportId: string): Promise<void> {
    const result = await this.reportService.deleteReport(reportId);
    this.handleResult(result);
  }

  @Patch(':id/status')
  async updateReportStatus(
    @Param('id') reportId: string,
    @Body('status') status: 'pending' | 'confirmed' | 'rejected',
  ): Promise<Report> {
    const result = await this.reportService.updateReportStatus(
      reportId,
      status,
    );
    return this.handleResult(result);
  }
}
