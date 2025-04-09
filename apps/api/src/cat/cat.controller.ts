/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatService } from './cat.service';
import { Cat } from './entities/cat';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    try {
      const cats = await this.catService.findAll();
      return cats;
    } catch (error) {
      throw new Error(`Database connection error: ${error.message}`);
    }
  }

  @Post()
  async create(@Body() createCatDto: Cat): Promise<Cat> {
    try {
      const newCat = await this.catService.create(createCatDto);
      return newCat;
    } catch (error) {
      throw new Error(`Database connection error: ${error.message}`);
    }
  }
}
