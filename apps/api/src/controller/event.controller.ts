import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
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
    @Res() res: Response,
  ) {
    const result = await this.eventService.registerParticipantToEvent(
      id,
      participant,
    );
    if (
      result &&
      typeof result === 'object' &&
      'error' in result &&
      result.error === 'already_registered'
    ) {
      return res.status(409).json({ message: 'Bạn đã đăng ký sự kiện này!' });
    }
    return res.json(result);
  }

  @Post('competition/:id/register')
  async registerParticipantToCompetition(
    @Param('id') id: string,
    @Body() participant: { id: string; avatar: string },
    @Res() res: Response,
  ) {
    const result = await this.eventService.registerParticipantToCompetition(
      id,
      participant,
    );
    if (
      result &&
      typeof result === 'object' &&
      'error' in result &&
      result.error === 'already_registered'
    ) {
      return res.status(409).json({ message: 'Bạn đã đăng ký cuộc thi này!' });
    }
    return res.json(result);
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
