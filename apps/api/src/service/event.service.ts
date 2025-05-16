import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Competition,
  CompetitionDocument,
  Event,
  EventDocument,
} from '../schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Competition.name)
    private competitionModel: Model<CompetitionDocument>,
  ) {}

  async createEvent(data: Partial<Event>): Promise<Event> {
    const created = new this.eventModel(data);
    return created.save();
  }

  async createCompetition(data: Partial<Competition>): Promise<Competition> {
    const created = new this.competitionModel(data);
    return created.save();
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventModel.find().sort({ date: 1 }).exec();
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return this.competitionModel.find().sort({ date: 1 }).exec();
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).exec();
  }

  async getCompetitionById(id: string): Promise<Competition | null> {
    return this.competitionModel.findById(id).exec();
  }

  async getEventsByOrganizer(walletAddress: string): Promise<Event[]> {
    return this.eventModel.find({ 'organizer.id': walletAddress }).exec();
  }

  async getCompetitionsByOrganizer(
    walletAddress: string,
  ): Promise<Competition[]> {
    return this.competitionModel.find({ 'organizer.id': walletAddress }).exec();
  }

  async registerParticipantToEvent(
    eventId: string,
    participant: { id: string; avatar: string },
  ): Promise<Event | null> {
    return this.eventModel
      .findByIdAndUpdate(
        eventId,
        {
          $push: { 'participants.registered': participant },
          $inc: { 'participants.count': 1 },
        },
        { new: true },
      )
      .exec();
  }

  async registerParticipantToCompetition(
    competitionId: string,
    participant: { id: string; avatar: string },
  ): Promise<Competition | null> {
    return this.competitionModel
      .findByIdAndUpdate(
        competitionId,
        {
          $push: { 'participants.registered': participant },
          $inc: { 'participants.count': 1 },
        },
        { new: true },
      )
      .exec();
  }

  async getEventsByParticipant(walletAddress: string): Promise<Event[]> {
    return this.eventModel
      .find({ 'participants.registered.id': walletAddress })
      .exec();
  }

  async getCompetitionsByParticipant(
    walletAddress: string,
  ): Promise<Competition[]> {
    return this.competitionModel
      .find({ 'participants.registered.id': walletAddress })
      .exec();
  }
}
