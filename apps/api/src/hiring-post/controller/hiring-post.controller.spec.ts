import { Test, TestingModule } from '@nestjs/testing';
import { HiringPostController } from './hiring-post.controller';

describe('HiringPostController', () => {
  let controller: HiringPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiringPostController],
    }).compile();

    controller = module.get<HiringPostController>(HiringPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
