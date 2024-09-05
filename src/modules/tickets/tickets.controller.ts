import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { TicketsService } from './tickets.service';
import { RolesDec } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { FastifyRequest } from 'fastify';
import { UserGuard } from 'src/shared/guards/user.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(RolesGuard, UserGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @RolesDec(UserRoles.Customer)
  @Post()
  buyTicket(@Body() dto: BuyTicketDto, @Req() req: FastifyRequest) {
    return this.ticketService.buyTicket(dto, req.user);
  }
}
