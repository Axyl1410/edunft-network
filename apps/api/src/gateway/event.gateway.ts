import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection() {}

  handleDisconnect() {}

  emitEventCreated(event: any) {
    this.server.emit('eventCreated', event);
  }

  emitCompetitionCreated(competition: any) {
    this.server.emit('competitionCreated', competition);
  }

  emitParticipantRegistered(data: {
    type: 'event' | 'competition';
    item: any;
    participant: any;
  }) {
    this.server.emit('participantRegistered', data);
  }
}
