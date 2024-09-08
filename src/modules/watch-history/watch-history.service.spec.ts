import { Test, TestingModule } from '@nestjs/testing';
import { WatchHistoryService } from './watch-history.service';
import ticketsTestData from '../tickets/tickets.test.data';
import watchHistoryTestData from './watch-history.test.data';
import { WatchHistory } from 'src/entities/watch-history.entity';
import { getModelToken } from '@nestjs/sequelize';
import { Ticket } from 'src/entities/ticket.entity';
import { User } from 'src/entities/users.entity';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

describe('WatchHistoryService', () => {
  let service: WatchHistoryService;
  let customer: User;

  const mockTicketModel = {
    findByPk: jest
      .fn()
      .mockImplementation((ticketId: string) =>
        Promise.resolve(watchHistoryTestData.getTicketById(ticketId)),
      ),
  };

  const mockWatchHistoryModel = {
    create: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
    findAndCountAll: jest
      .fn()
      .mockImplementation((dto: { where: { customerId: string } }) => {
        const data = watchHistoryTestData.getWatchHistoryOfCustomer(
          dto.where.customerId,
        );

        return Promise.resolve({
          count: data.length,
          rows: data,
        });
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchHistoryService,
        {
          provide: getModelToken(Ticket),
          useValue: mockTicketModel,
        },
        {
          provide: getModelToken(WatchHistory),
          useValue: mockWatchHistoryModel,
        },
      ],
    }).compile();

    service = module.get<WatchHistoryService>(WatchHistoryService);
    customer = ticketsTestData.customer as User;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error when ticket info is wrong', async () => {
    let thrownError;

    try {
      await service.watchMovie(
        { ticketId: 'c4ead90b-ef1d-4ba1-b63a-73bd9d59d20e' },
        customer,
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new ServerError(ServerErrorType.NOT_FOUND, 'Ticket'),
    );
  });

  it("should throw error when ticket doesn't belong to customer", async () => {
    let thrownError;

    try {
      await service.watchMovie(
        { ticketId: '76762c70-829f-415b-bbd7-86541916bc8c' },
        customer,
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new ServerError(ServerErrorType.INVALID_TICKET),
    );
  });

  it('should watch movie', async () => {
    expect(
      await service.watchMovie(
        {
          ticketId: '52750418-8f53-468d-a5af-e93108b0bb41',
        },
        customer,
      ),
    ).toEqual(undefined);
  });

  it('should get watch history', async () => {
    const result = await service.getWatchHistory(customer);
    const count = result.count;
    const rows = result.rows;

    // @ts-ignore
    const expectedResult: Partial<WatchHistory>[] =
      watchHistoryTestData.getWatchHistoryOfCustomer(customer.id);

    expect(count).toEqual(expectedResult.length);

    expectedResult.forEach((result) => {
      expect(rows).toEqual(
        expect.arrayContaining([expect.objectContaining(result)]),
      );
    });
  });
});
