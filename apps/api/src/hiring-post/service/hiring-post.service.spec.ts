import { Test, TestingModule } from '@nestjs/testing';
import { HiringPostService } from './hiring-post.service';

describe('HiringPostService', () => {
  let service: HiringPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiringPostService],
    }).compile();

    service = module.get<HiringPostService>(HiringPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
