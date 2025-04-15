import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolController } from './controller/school.controller';
import { SchoolSchema } from './school.schema';
import { SchoolService } from './service/school.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'School', schema: SchoolSchema }]),
  ],
  providers: [SchoolService],
  controllers: [SchoolController],
})
export class SchoolModule {}
