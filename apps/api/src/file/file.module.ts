import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from './controller/file.controller';
import { FileCID, FileCIDSchema } from './schemas/file-cid.schema';
import { File, FileSchema } from './schemas/file.schema';
import { FileService } from './service/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: FileCID.name, schema: FileCIDSchema },
    ]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
