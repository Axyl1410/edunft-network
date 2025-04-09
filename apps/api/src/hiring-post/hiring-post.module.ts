import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HiringPostController } from './controller/hiring-post.controller';
import { HiringPostService } from './service/hiring-post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HiringPost', schema: HiringPostController },
    ]),
  ],
  controllers: [HiringPostController],
  providers: [HiringPostService],
})
export class HiringPostModule {}
