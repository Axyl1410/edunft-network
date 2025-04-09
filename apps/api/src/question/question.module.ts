import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './controller/question.controller';
import { QuestionService } from './service/question.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionService }]),
  ],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
