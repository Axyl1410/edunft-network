import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Competition, Event } from '../schema/event.schema';
import { EventService } from '../service/event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() body: Partial<Event>) {
    return this.eventService.createEvent(body);
  }

  @Post('competition')
  async createCompetition(@Body() body: Partial<Competition>) {
    return this.eventService.createCompetition(body);
  }

  @Get()
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('competition')
  async getAllCompetitions() {
    return this.eventService.getAllCompetitions();
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @Get('competition/:id')
  async getCompetitionById(@Param('id') id: string) {
    return this.eventService.getCompetitionById(id);
  }

  @Get('by-organizer/:walletAddress')
  async getEventsByOrganizer(@Param('walletAddress') walletAddress: string) {
    return this.eventService.getEventsByOrganizer(walletAddress);
  }

  @Get('competition/by-organizer/:walletAddress')
  async getCompetitionsByOrganizer(
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.eventService.getCompetitionsByOrganizer(walletAddress);
  }

  @Post(':id/register')
  async registerParticipantToEvent(
    @Param('id') id: string,
    @Body() participant: { id: string; avatar: string },
  ) {
    return this.eventService.registerParticipantToEvent(id, participant);
  }

  @Post('competition/:id/register')
  async registerParticipantToCompetition(
    @Param('id') id: string,
    @Body() participant: { id: string; avatar: string },
  ) {
    return this.eventService.registerParticipantToCompetition(id, participant);
  }

  @Get('by-participant/:walletAddress')
  async getEventsByParticipant(@Param('walletAddress') walletAddress: string) {
    return this.eventService.getEventsByParticipant(walletAddress);
  }

  @Get('competition/by-participant/:walletAddress')
  async getCompetitionsByParticipant(
    @Param('walletAddress') walletAddress: string,
  ) {
    return this.eventService.getCompetitionsByParticipant(walletAddress);
  }
}
