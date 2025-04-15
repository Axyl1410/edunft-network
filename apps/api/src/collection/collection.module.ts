import { Module } from '@nestjs/common';
import { CollectionController } from './controller/collection.controller';
import { CollectionService } from './service/collection.service';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
