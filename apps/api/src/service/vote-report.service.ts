import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from 'src/schema/report.schema';
import { Vote, VoteDocument } from 'src/schema/vote.schema';
import { FileService } from './file.service';
import { UserService } from './user.service';

@Injectable()
export class VoteReportService {
  constructor(
    @InjectModel(Vote.name) private readonly voteModel: Model<VoteDocument>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}
}
