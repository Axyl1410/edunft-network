import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from 'src/controller/file.controller';
import { File, FileSchema } from 'src/schema/file.schema';
import { FileService } from 'src/service/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
