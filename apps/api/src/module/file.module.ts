import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from 'src/controller/file.controller';
import { File, FileSchema } from 'src/schema/file.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { FileService } from 'src/service/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
