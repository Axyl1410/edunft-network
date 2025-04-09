import { Module } from '@nestjs/common';
import { HiringPostController } from './controller/hiring-post.controller';
import { HiringPostService } from './service/hiring-post.service';

@Module({
  controllers: [HiringPostController],
  providers: [HiringPostService],
})
export class HiringPostModule {}
