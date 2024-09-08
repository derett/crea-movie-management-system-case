import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import ticketsTestData from './tickets.test.data';
import { User } from 'src/entities/users.entity';
import { getModelToken } from '@nestjs/sequelize';
import { Ticket } from 'src/entities/ticket.entity';
import { Session } from 'src/entities/session.entity';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

describe('TicketsService', () => {
  let service: TicketsService;
  let customer: User;

  const mockTicketModel = {
    create: jest
      .fn()
      .mockImplementation((dto: { sessionId: string; customerId: string }) =>
        Promise.resolve({
          sessionId: dto.sessionId,
          customerId: dto.customerId,
        }),
      ),
  };
  const mockSessionModel = {
    findByPk: jest.fn().mockImplementation((sessionId: string) => {
      const session = ticketsTestData.sessions.find((o) => o.id === sessionId);

      if (session) {
        const movie = ticketsTestData.movies.find(
          (o) => o.id === session.movieId,
        );
        return Promise.resolve({
          ...session,
          movie,
        });
      } else {
        return Promise.resolve(undefined);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getModelToken(Ticket),
          useValue: mockTicketModel,
        },
        {
          provide: getModelToken(Session),
          useValue: mockSessionModel,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    customer = ticketsTestData.customer as User;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error when session info is wrong', async () => {
    let thrownError;

    try {
      await service.buyTicket(
        { sessionId: 'c4ead90b-ef1d-4ba1-b63a-73bd9d59d20e' },
        customer,
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new ServerError(ServerErrorType.NOT_FOUND, 'Session'),
    );
  });

  it('should throw error when customer is under age', async () => {
    let thrownError;

    try {
      await service.buyTicket(
        { sessionId: ticketsTestData.sessions[0].id },
        customer,
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new ServerError(ServerErrorType.AGE_RESTRICTION, '20'),
    );
  });

  it('should buyTicket', async () => {
    const data = await service.buyTicket(
      {
        sessionId: ticketsTestData.sessions[1].id,
      },
      customer,
    );

    expect(data).toEqual(
      expect.objectContaining({
        sessionId: ticketsTestData.sessions[1].id,
        customerId: customer.id,
      }),
    );
  });
});
