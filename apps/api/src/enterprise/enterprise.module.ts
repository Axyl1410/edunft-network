import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnterpriseController } from './controller/enterprise.controller';
import { EnterpriseSchema } from './enterprise.schema';
import { EnterpriseService } from './service/enterprise.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Enterprise', schema: EnterpriseSchema },
    ]),
  ],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
})
export class EnterpriseModule {}
