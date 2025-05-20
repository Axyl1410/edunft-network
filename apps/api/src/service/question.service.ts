import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, Question, QuestionDocument } from '../schema/question.schema';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  private provider: ethers.JsonRpcProvider;

  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private blockchainService: BlockchainService,
  ) {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  }

  async createQuestion(data: Partial<Question>): Promise<Question> {
    try {
      this.logger.debug('Creating question with data:', data);

      if (!data) {
        throw new BadRequestException('Question data is required');
      }

      // Validate required fields
      if (!data.title) {
        throw new BadRequestException('Title is required');
      }
      if (!data.description) {
        throw new BadRequestException('Description is required');
      }
      if (!data.tokens) {
        throw new BadRequestException('Tokens is required');
      }
      if (!data.author) {
        throw new BadRequestException('Author is required');
      }
      if (!data.author.walletAddress) {
        throw new BadRequestException('Author wallet address is required');
      }
      if (!data.author.name) {
        throw new BadRequestException('Author name is required');
      }
      if (!data.author.avatar) {
        throw new BadRequestException('Author avatar is required');
      }

      // Create question in blockchain
      const questionId =
        data._id?.toString() || new Date().getTime().toString();
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const txHash = await this.blockchainService.createQuestion(
        questionId,
        BigInt(data.tokens),
        signer,
      );

      const created = new this.questionModel({
        ...data,
        votes: 0,
        views: 0,
        answers: [],
        blockchainTxHash: txHash,
      });

      this.logger.debug('Question model created:', created);

      const savedQuestion = await created.save();
      this.logger.debug('Question saved successfully:', savedQuestion);

      return savedQuestion;
    } catch (error) {
      this.logger.error('Error creating question:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Error creating question');
    }
  }

  async getQuestionsByWallet(walletAddress: string): Promise<Question[]> {
    return this.questionModel
      .find({ 'author.walletAddress': walletAddress })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionModel.find().sort({ createdAt: -1 }).exec();
  }

  async getQuestionById(id: string): Promise<Question | null> {
    try {
      // Find and update in one operation to increment views
      const question = await this.questionModel
        .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
        .exec();

      if (!question) {
        throw new BadRequestException('Question not found');
      }

      return question;
    } catch (error) {
      this.logger.error('Error getting question by id:', error);
      throw error;
    }
  }

  async addAnswer(
    questionId: string,
    answer: Answer,
  ): Promise<Question | null> {
    try {
      // Submit answer to blockchain
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const txHash = await this.blockchainService.submitAnswer(
        questionId,
        answer._id.toString(),
        signer,
      );

      // Add answer to database
      const question = await this.questionModel
        .findByIdAndUpdate(
          questionId,
          {
            $push: {
              answers: {
                ...answer,
                blockchainTxHash: txHash,
              },
            },
          },
          { new: true },
        )
        .exec();

      return question;
    } catch (error) {
      this.logger.error('Error adding answer:', error);
      throw error;
    }
  }

  async voteQuestion(
    id: string,
    type: 'up' | 'down',
  ): Promise<Question | null> {
    const inc = type === 'up' ? 1 : -1;
    return this.questionModel
      .findByIdAndUpdate(id, { $inc: { votes: inc } }, { new: true })
      .exec();
  }

  async voteAnswer(
    questionId: string,
    answerId: string,
    voterAddress: string,
  ): Promise<Question | null> {
    try {
      const question = await this.questionModel.findById(questionId);
      if (!question) {
        throw new BadRequestException('Question not found');
      }

      const answer = question.answers.find(
        (a) => a._id.toString() === answerId,
      );
      if (!answer) {
        throw new BadRequestException('Answer not found');
      }

      // Submit vote to blockchain
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const txHash = await this.blockchainService.voteAnswer(
        questionId,
        answerId,
        1, // Upvote
        signer,
      );

      // Update vote count in database
      const updatedQuestion = await this.questionModel
        .findOneAndUpdate(
          {
            _id: questionId,
            'answers._id': answerId,
          },
          {
            $inc: { 'answers.$.votes': 1 },
            $set: { 'answers.$.blockchainVoteTxHash': txHash },
          },
          { new: true },
        )
        .exec();

      return updatedQuestion;
    } catch (error) {
      this.logger.error('Error voting answer:', error);
      throw error;
    }
  }

  async acceptAnswer(
    questionId: string,
    answerId: string,
  ): Promise<Question | null> {
    try {
      const question = await this.questionModel.findById(questionId);
      if (!question) {
        throw new BadRequestException('Question not found');
      }

      const answer = question.answers.find(
        (a) => a._id.toString() === answerId,
      );
      if (!answer) {
        throw new BadRequestException('Answer not found');
      }

      // Accept answer in blockchain
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const txHash = await this.blockchainService.acceptAnswer(
        questionId,
        answer.author.walletAddress,
        signer,
      );

      // Update question in database
      const updatedQuestion = await this.questionModel
        .findByIdAndUpdate(
          questionId,
          {
            $set: {
              'answers.$[answer].isAccepted': true,
              'answers.$[answer].blockchainAcceptTxHash': txHash,
            },
          },
          {
            arrayFilters: [{ 'answer._id': answerId }],
            new: true,
          },
        )
        .exec();

      return updatedQuestion;
    } catch (error) {
      this.logger.error('Error accepting answer:', error);
      throw error;
    }
  }
}
