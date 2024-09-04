import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from 'src/entities/ticket.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from 'src/entities/session.entity';

@Module({
  imports: [SequelizeModule.forFeature([Ticket, Session])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
