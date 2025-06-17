// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { QuestionController } from '../controller/question.controller';
// import { Question, QuestionSchema } from '../schema/question.schema';
// import { QuestionService } from '../service/question.service';
// import { BlockchainModule } from '../blockchain/blockchain.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Question.name, schema: QuestionSchema },
//     ]),
//     BlockchainModule,
//   ],
//   controllers: [QuestionController],
//   providers: [QuestionService],
//   exports: [QuestionService],
// })
// export class QuestionModule {}
