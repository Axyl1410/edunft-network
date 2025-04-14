import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerModule } from './answer/answer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { DocumentModule } from './document/document.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { HiringPostModule } from './hiring-post/hiring-post.module';
import { QuestionModule } from './question/question.module';
import { SchoolModule } from './school/school.module';
import { StudentsModule } from './students/students.module';
import { TransactionModule } from './transaction/transaction.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CatModule,
    StudentsModule,
    SchoolModule,
    EnterpriseModule,
    AnswerModule,
    DocumentModule,
    HiringPostModule,
    QuestionModule,
    TransactionModule,
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
