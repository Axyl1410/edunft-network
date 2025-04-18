import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatController } from './controller/cat.controller';
import { CatSchema } from './schemas/cat.schema';
import { CatService } from './service/cat.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }])],
  providers: [CatService],
  controllers: [CatController],
})
export class CatModule {}
