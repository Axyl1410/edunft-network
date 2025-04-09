import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './entities/cat';
import { CatDocument } from './schemas/cat.schema';

@Injectable()
export class CatService {
  constructor(
    @InjectModel('Cat') private readonly catModel: Model<CatDocument>,
  ) {}

  async create(createCatDto: Cat): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
