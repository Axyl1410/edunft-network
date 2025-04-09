import { Module } from '@nestjs/common';
import { AnswerController } from './controller/answer.controller';
import { AnswerService } from './service/answer.service';

@Module({
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
