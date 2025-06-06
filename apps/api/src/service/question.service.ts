import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, Question, QuestionDocument } from '../schema/question.schema';
import { BlockchainService } from '../blockchain/blockchain.service';
import { ethers } from 'ethers';
import { Types } from 'mongoose';

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
      this.logger.debug('Getting question by id:', id);
      
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid question ID format');
      }

      // Find and update in one operation to increment views
      const question = await this.questionModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { $inc: { views: 1 } },
          { new: true }
        )
        .exec();

      if (!question) {
        throw new BadRequestException('Question not found');
      }

      this.logger.debug('Question found:', question);
      return question;
    } catch (error) {
      this.logger.error('Error getting question by id:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Error getting question');
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
    voterReputation: number,
    voteType: 'up' | 'down'
  ): Promise<Question | null> {
    try {
      const question = await this.questionModel.findById(id);
      if (!question) {
        throw new BadRequestException('Question not found');
      }

      // Check if question is less than 24 hours old
      const questionAge = Date.now() - question.createdAt.getTime();
      const hoursOld = questionAge / (1000 * 60 * 60);

      if (hoursOld < 24 && voteType === 'down') {
        throw new BadRequestException('Cannot downvote questions less than 24 hours old');
      }

      // Check reputation requirements
      if (voteType === 'down' && voterReputation < 95) {
        throw new BadRequestException('You need at least 95 reputation points to downvote');
      }

      if (voteType === 'up' && voterReputation < 85) {
        throw new BadRequestException('You need at least 85 reputation points to upvote');
      }

      return this.questionModel
        .findByIdAndUpdate(
          id, 
          { $inc: { votes: voteType === 'up' ? 1 : -1 } }, 
          { new: true }
        )
        .exec();
    } catch (error) {
      this.logger.error('Error voting question:', error);
      throw error;
    }
  }

  async voteAnswer(
    questionId: string,
    answerId: string,
    voterAddress: string,
    voterReputation: number,
    voteType: 'up' | 'down'
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

      // Check if answer is less than 24 hours old
      const answerAge = Date.now() - answer.createdAt.getTime();
      const hoursOld = answerAge / (1000 * 60 * 60);

      if (hoursOld < 24 && voteType === 'down') {
        throw new BadRequestException('Cannot downvote answers less than 24 hours old');
      }

      // Check reputation requirements
      if (voteType === 'down' && voterReputation < 95) {
        throw new BadRequestException('You need at least 95 reputation points to downvote');
      }

      if (voteType === 'up' && voterReputation < 85) {
        throw new BadRequestException('You need at least 85 reputation points to upvote');
      }

      // Update vote count in database
      const updatedQuestion = await this.questionModel
        .findOneAndUpdate(
          {
            _id: questionId,
            'answers._id': answerId,
          },
          { 
            $inc: { 'answers.$.votes': voteType === 'up' ? 1 : -1 }
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
