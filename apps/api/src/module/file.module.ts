import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from 'src/controller/file.controller';
import { FileCID, FileCIDSchema } from 'src/schema/file-cid.schema';
import { FileSchema } from 'src/schema/file.schema';
import { FileService } from 'src/service/file.service';

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
