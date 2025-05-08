import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from 'src/controller/report.controller';
import { File, FileSchema } from 'src/schema/file.schema';
import { Report, ReportSchema } from 'src/schema/report.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { FileService } from 'src/service/file.service';
import { ReportService } from 'src/service/report.service';
import { UserService } from 'src/service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: User.name, schema: UserSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService, FileService, UserService],
})
export class ReportModule {}
