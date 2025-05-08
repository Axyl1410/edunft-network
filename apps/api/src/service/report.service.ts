import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { Report, ReportDocument } from 'src/schema/report.schema';
import { FileService } from './file.service';
import { UserService } from './user.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  // Create a new report
  async createReport(
    walletAddress: string,
    hash: string,
    reason: string,
    description: string,
  ): Promise<
    Result<Report, NotFoundFailure | DatabaseFailure | ValidationFailure>
  > {
    if (!walletAddress || !hash || !reason) {
      return new Fail(
        new ValidationFailure('Wallet Address, Hash or Reason', walletAddress),
      );
    }

    try {
      const file = await this.fileService.getFileIdbyHash(hash);
      if (!file) {
        return new Fail(
          new NotFoundFailure(`File with hash ${hash} not found.`),
        );
      }

      const user =
        await this.userService.getUserIdByWalletAddress(walletAddress);
      if (!user) {
        return new Fail(
          new NotFoundFailure(
            `User with wallet address ${walletAddress} not found.`,
          ),
        );
      }

      const newReport = new this.reportModel({
        User: user._id,
        File: file._id,
        Reason: reason,
        Description: description,
        Status: 'pending',
      });

      const savedReport = await newReport.save();

      if (!savedReport) {
        return new Fail(
          new NotFoundFailure(
            `Failed to create report for file with hash ${hash}.`,
          ),
        );
      }

      return new Success(savedReport);
    } catch (error) {
      console.error('Error creating report:', error);
      return new Fail(new DatabaseFailure('Failed to create report.'));
    }
  }

  // Delete a report by ID
  async deleteReport(
    reportId: string,
  ): Promise<
    Result<void, NotFoundFailure | ValidationFailure | DatabaseFailure>
  > {
    if (!reportId) {
      return new Fail(new ValidationFailure('Report ID', reportId));
    }

    try {
      const deletedReport = await this.reportModel.findByIdAndDelete(reportId);

      if (!deletedReport) {
        return new Fail(
          new NotFoundFailure(`Report with ID ${reportId} not found.`),
        );
      }

      return new Success(undefined);
    } catch (error) {
      console.error('Error deleting report:', error);
      return new Fail(new DatabaseFailure('Failed to delete report.'));
    }
  }

  // Update a report's status
  async updateReportStatus(
    reportId: string,
    status: 'pending' | 'confirmed' | 'rejected',
  ): Promise<Result<Report, NotFoundFailure | DatabaseFailure>> {
    const report = await this.reportModel.findById(reportId);
    if (!report) {
      return new Fail(
        new NotFoundFailure(`Report with ID ${reportId} not found.`),
      );
    }

    try {
      report.Status = status;
      const updatedReport = await report.save();

      if (!updatedReport) {
        return new Fail(
          new NotFoundFailure(`Failed to update report with ID ${reportId}.`),
        );
      }

      return new Success(updatedReport);
    } catch (error) {
      console.error('Error updating report status:', error);
      return new Fail(new DatabaseFailure('Failed to update report status.'));
    }
  }

  async getReportByHash(
    hash: string,
  ): Promise<Result<Report[], NotFoundFailure | DatabaseFailure>> {
    if (!hash) {
      return new Fail(new ValidationFailure('File', hash));
    }

    try {
      const file = await this.fileService.getFileIdbyHash(hash);
      if (!file) {
        return new Fail(
          new NotFoundFailure(`File with hash ${hash} not found.`),
        );
      }

      const report = await this.reportModel
        .find({ File: file._id })
        .lean()
        .exec();

      if (!report) {
        return new Fail(
          new NotFoundFailure(`Report for file with hash ${hash} not found.`),
        );
      }

      return new Success(report);
    } catch (error) {
      console.error('Error fetching report by hash:', error);
      return new Fail(new DatabaseFailure('Failed to fetch report by hash.'));
    }
  }

  async getReportByWalletAddress(
    WalletAddress: string,
  ): Promise<Result<Report[], NotFoundFailure | DatabaseFailure>> {
    if (!WalletAddress) {
      return new Fail(new ValidationFailure('Wallet Address', WalletAddress));
    }

    try {
      const user =
        await this.userService.getUserIdByWalletAddress(WalletAddress);
      if (!user) {
        return new Fail(
          new NotFoundFailure(
            `User with wallet address ${WalletAddress} not found.`,
          ),
        );
      }

      const report = await this.reportModel
        .find({ User: user._id })
        .lean()
        .exec();

      if (!report) {
        return new Fail(
          new NotFoundFailure(
            `Report for user with wallet address ${WalletAddress} not found.`,
          ),
        );
      }

      return new Success(report);
    } catch (error) {
      console.error('Error fetching report by wallet address:', error);
      return new Fail(
        new DatabaseFailure('Failed to fetch report by wallet address.'),
      );
    }
  }

  async getAllReports(): Promise<Result<Report[], DatabaseFailure>> {
    try {
      const allReports = await this.reportModel.find().lean().exec();
      return new Success(allReports);
    } catch (error) {
      console.error('Error fetching all reports:', error);
      return new Fail(new DatabaseFailure('Failed to fetch all reports.'));
    }
  }
}
