import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoteController } from 'src/controller/vote.controller';
import { FileSchema } from 'src/schema/file.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { Vote, VoteSchema } from 'src/schema/vote.schema';
import { FileService } from 'src/service/file.service';
import { UserService } from 'src/service/user.service';
import { VoteService } from 'src/service/vote.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vote.name, schema: VoteSchema },
      { name: File.name, schema: FileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [VoteController],
  providers: [VoteService, FileService, UserService],
})
export class VoteModule {}
