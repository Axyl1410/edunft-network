import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'src/schema/collection.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { CollectionController } from '../controller/collection.controller';
import { CollectionService } from '../service/collection.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
