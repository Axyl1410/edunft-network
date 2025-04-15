import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './controller/document.controller';
import { DocumentsSchema } from './document.schema';
import { DocumentService } from './service/document.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentsSchema }]),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
