import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HiringPostController } from './controller/hiring-post.controller';
import { HiringPostSchema } from './hiring-post.schema';
import { HiringPostService } from './service/hiring-post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HiringPost', schema: HiringPostSchema },
    ]),
  ],
  controllers: [HiringPostController],
  providers: [HiringPostService],
})
export class HiringPostModule {}
