import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './cat.schema';
import { CatController } from './controller/cat.controller';
import { CatService } from './service/cat.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }])],
  providers: [CatService],
  controllers: [CatController],
})
export class CatModule {}
