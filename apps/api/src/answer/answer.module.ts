import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerController } from './controller/answer.controller';
import { AnswerService } from './service/answer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Answer', schema: AnswerController }]),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
