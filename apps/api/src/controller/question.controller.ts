import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Answer, Question } from '../schema/question.schema';
import { QuestionService } from '../service/question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async createQuestion(@Body() body: Partial<Question>) {
    return this.questionService.createQuestion(body);
  }

  @Get()
  async getAllQuestions() {
    return this.questionService.getAllQuestions();
  }

  @Get('by-wallet/:walletAddress')
  async getQuestionsByWallet(@Param('walletAddress') walletAddress: string) {
    return this.questionService.getQuestionsByWallet(walletAddress);
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionService.getQuestionById(id);
  }

  @Patch(':id/answer')
  async addAnswer(@Param('id') id: string, @Body() answer: Answer) {
    return this.questionService.addAnswer(id, answer);
  }

  @Patch(':id/vote')
  async voteQuestion(
    @Param('id') id: string,
    @Query('type') type: 'up' | 'down',
  ) {
    return this.questionService.voteQuestion(id, type);
  }

  @Patch(':id/view')
  async incrementViews(@Param('id') id: string) {
    return this.questionService.incrementViews(id);
  }
}
