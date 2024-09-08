import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { User } from 'src/entities/users.entity';
import { CanActivate } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserGuard } from 'src/shared/guards/user.guard';
import ticketsTestData from './tickets.test.data';
import { FastifyRequest } from 'fastify';
import { UsersService } from '../users/users.service';

describe('TicketsController', () => {
  let controller: TicketsController;

  const mockService = {
    buyTicket: jest.fn((dto: BuyTicketDto, customer: User) => {
      return {
        customerId: customer.id,
        sessionId: dto.sessionId,
      };
    }),
  };
  const mockUsersService = {
    getByUsername: jest.fn(() => Promise.resolve()),
  };
  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const mockUserGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [TicketsService],
    })
      .overrideProvider(TicketsService)
      .useValue(mockService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .overrideGuard(UserGuard)
      .useValue(mockUserGuard)
      .compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should buy ticket', async () => {
    const session = ticketsTestData.sessions[0];
    const customer = ticketsTestData.customer;
    const dto: BuyTicketDto = {
      sessionId: session.id,
    };
    const request = { user: customer } as FastifyRequest;
    expect(await controller.buyTicket(dto, request)).toEqual({
      ...dto,
      customerId: customer.id,
    });
  });
});
