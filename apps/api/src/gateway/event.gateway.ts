import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

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
