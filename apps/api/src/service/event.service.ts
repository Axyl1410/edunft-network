/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventGateway } from '../gateway/event.gateway';
import {
  Competition,
  CompetitionDocument,
  Event,
  EventDocument,
  Participant,
} from '../schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Competition.name)
    private competitionModel: Model<CompetitionDocument>,
    private readonly eventGateway: EventGateway,
  ) {}

  async createEvent(data: Partial<Event>): Promise<Event> {
    const created = new this.eventModel(data);
    const saved = await created.save();
    this.eventGateway.emitEventCreated(saved);
    return saved;
  }

  async createCompetition(data: Partial<Competition>): Promise<Competition> {
    const created = new this.competitionModel(data);
    const saved = await created.save();
    this.eventGateway.emitCompetitionCreated(saved);
    return saved;
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
  ): Promise<Event | { error: string } | null> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) return null;
    const registered = event.participants.registered as Participant[];
    const alreadyRegistered = registered.some((p) => p.id === participant.id);
    if (alreadyRegistered) {
      return { error: 'already_registered' };
    }
    const updated = await this.eventModel
      .findByIdAndUpdate(
        eventId,
        {
          $push: { 'participants.registered': participant },
          $inc: { 'participants.count': 1 },
        },
        { new: true },
      )
      .exec();
    if (updated) {
      this.eventGateway.emitParticipantRegistered({
        type: 'event',
        item: updated,
        participant,
      });
    }
    return updated;
  }

  async registerParticipantToCompetition(
    competitionId: string,
    participant: { id: string; avatar: string },
  ): Promise<Competition | { error: string } | null> {
    const competition = await this.competitionModel
      .findById(competitionId)
      .exec();
    if (!competition) return null;
    const registered = competition.participants.registered as Participant[];
    const alreadyRegistered = registered.some((p) => p.id === participant.id);
    if (alreadyRegistered) {
      return { error: 'already_registered' };
    }
    const updated = await this.competitionModel
      .findByIdAndUpdate(
        competitionId,
        {
          $push: { 'participants.registered': participant },
          $inc: { 'participants.count': 1 },
        },
        { new: true },
      )
      .exec();
    if (updated) {
      this.eventGateway.emitParticipantRegistered({
        type: 'competition',
        item: updated,
        participant,
      });
    }
    return updated;
  }

  async getEventsByParticipant(walletAddress: string): Promise<Event[]> {
    return this.eventModel
      .find({ 'participants.registered.id': walletAddress })
      .exec();
  }

  async getCompetitionsByParticipant(
    walletAddress: string,
  ): Promise<Competition[]> {
    // Query for competitions where any registered participant has the given walletAddress
    const competitions = await this.competitionModel
      .find({ 'participants.registered.id': walletAddress })
      .exec();
    // Debug log if empty
    if (!competitions || competitions.length === 0) {
      console.log('No competitions found for participant', walletAddress);
    }
    return competitions;
  }
}
