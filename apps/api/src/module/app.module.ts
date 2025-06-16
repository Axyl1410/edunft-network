import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { AuthModule } from './auth.module';
import { CollectionModule } from './collection.module';
import { EventModule } from './event.module';
import { FileModule } from './file.module';
// import { QuestionModule } from './question.module';
import { ReportModule } from './report.module';
import { UserModule } from './user.module';
import { VoteModule } from './vote.module';

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
    FileModule,
    CollectionModule,
    UserModule,
    VoteModule,
    ReportModule,
    // QuestionModule,
    EventModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
