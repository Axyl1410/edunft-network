import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, Question, QuestionDocument } from '../schema/question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async createQuestion(data: Partial<Question>): Promise<Question> {
    const created = new this.questionModel({
      ...data,
      votes: 0,
      views: 0,
      answers: [],
    });
    return created.save();
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
    return this.questionModel.findById(id).exec();
  }

  async addAnswer(
    questionId: string,
    answer: Answer,
  ): Promise<Question | null> {
    return this.questionModel
      .findByIdAndUpdate(
        questionId,
        { $push: { answers: answer } },
        { new: true },
      )
      .exec();
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

  async incrementViews(id: string): Promise<Question | null> {
    return this.questionModel
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .exec();
  }
}
