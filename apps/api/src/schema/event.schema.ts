import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Coordinates {
  @Prop({ required: true })
  lat: number;
  @Prop({ required: true })
  lng: number;
}

class Location {
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  city: string;
  @Prop({ type: Coordinates })
  coordinates?: Coordinates;
}

class Organizer {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  avatar: string;
}

class Participant {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  avatar: string;
}

class Participants {
  @Prop({ required: true })
  count: number;
  @Prop({ type: [Participant], default: [] })
  registered: Participant[];
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  startTime: string;
  @Prop({ required: true })
  endTime: string;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true, type: Location })
  location: Location;
  @Prop({ required: true, type: Organizer })
  organizer: Organizer;
  @Prop({ required: true, type: Participants })
  participants: Participants;
  @Prop({ required: true })
  status: 'upcoming' | 'ongoing' | 'completed';
  @Prop({ required: true })
  imageUrl: string;
  @Prop({ required: true })
  description: string;
  @Prop() // optional
  capacity?: number;
  @Prop({ required: true })
  type: 'event';
  @Prop({ required: true })
  category: string;
}

@Schema({ timestamps: true })
export class Competition {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  startTime: string;
  @Prop({ required: true })
  endTime: string;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true, type: Location })
  location: Location;
  @Prop({ required: true, type: Organizer })
  organizer: Organizer;
  @Prop({ required: true, type: Participants })
  participants: Participants;
  @Prop({ required: true })
  status: 'upcoming' | 'ongoing' | 'completed';
  @Prop({ required: true })
  imageUrl: string;
  @Prop({ required: true })
  description: string;
  @Prop() // optional
  capacity?: number;
  @Prop({ required: true })
  type: 'competition';
  @Prop({ required: true })
  prize: string;
  @Prop({ required: true })
  deadline: Date;
  @Prop({ type: [String], default: [] })
  requirements: string[];
}

export type EventDocument = Event & Document;
export type CompetitionDocument = Competition & Document;
export const EventSchema = SchemaFactory.createForClass(Event);
export const CompetitionSchema = SchemaFactory.createForClass(Competition);
