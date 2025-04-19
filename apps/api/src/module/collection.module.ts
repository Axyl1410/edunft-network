import { Module } from '@nestjs/common';
import { CollectionService } from '../service/collection.service';
import { CollectionController } from '../controller/collection.controller';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
