import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from '../controller/event.controller';
import {
  Competition,
  CompetitionSchema,
  Event,
  EventSchema,
} from '../schema/event.schema';
import { EventService } from '../service/event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Competition.name, schema: CompetitionSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
