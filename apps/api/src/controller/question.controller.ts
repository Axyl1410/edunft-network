import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Answer, Question } from '../schema/question.schema';
import { QuestionService } from '../service/question.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
// @UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async createQuestion(@Body() body: Partial<Question>, @Request() req) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    // Validate required fields
    if (!body.title) {
      throw new BadRequestException('Title is required');
    }
    if (!body.description) {
      throw new BadRequestException('Description is required');
    }
    if (!body.tokens) {
      throw new BadRequestException('Tokens is required');
    }
    if (!body.author) {
      throw new BadRequestException('Author is required');
    }
    if (!body.author.walletAddress) {
      throw new BadRequestException('Author wallet address is required');
    }
    if (!body.author.name) {
      throw new BadRequestException('Author name is required');
    }
    if (!body.author.avatar) {
      throw new BadRequestException('Author avatar is required');
    }

    // Verify wallet address matches authenticated user
    if (
      body.author.walletAddress.toLowerCase() !==
      req.user.walletAddress.toLowerCase()
    ) {
      throw new BadRequestException(
        'Wallet address does not match authenticated user',
      );
    }

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

  @Patch(':id/answers')
  async addAnswer(
    @Param('id') id: string,
    @Body() answer: Answer,
    @Request() req,
  ) {
    if (!answer) {
      throw new BadRequestException('Answer data is required');
    }
    if (!answer.content) {
      throw new BadRequestException('Answer content is required');
    }
    if (!answer.author) {
      throw new BadRequestException('Author is required');
    }
    if (!answer.author.walletAddress) {
      throw new BadRequestException('Author wallet address is required');
    }
    if (!answer.author.name) {
      throw new BadRequestException('Author name is required');
    }
    if (!answer.author.avatar) {
      throw new BadRequestException('Author avatar is required');
    }

    // Verify wallet address matches authenticated user
    if (
      answer.author.walletAddress.toLowerCase() !==
      req.user.walletAddress.toLowerCase()
    ) {
      throw new BadRequestException(
        'Wallet address does not match authenticated user',
      );
    }

    return this.questionService.addAnswer(id, answer);
  }

  @Patch(':questionId/answers/:answerId/vote')
  async voteAnswer(
    @Param('questionId') questionId: string,
    @Param('answerId') answerId: string,
    @Request() req,
  ) {
    return this.questionService.voteAnswer(
      questionId,
      answerId,
      req.user.walletAddress,
    );
  }

  @Patch(':questionId/answers/:answerId/accept')
  async acceptAnswer(
    @Param('questionId') questionId: string,
    @Param('answerId') answerId: string,
    @Request() req,
  ) {
    const question = await this.questionService.getQuestionById(questionId);
    if (!question) {
      throw new BadRequestException('Question not found');
    }

    // Verify question author matches authenticated user
    if (
      question.author.walletAddress.toLowerCase() !==
      req.user.walletAddress.toLowerCase()
    ) {
      throw new BadRequestException('Only question author can accept answers');
    }

    return this.questionService.acceptAnswer(questionId, answerId);
  }
}
