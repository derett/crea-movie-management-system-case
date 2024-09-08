import { Test, TestingModule } from '@nestjs/testing';
import { WatchHistoryController } from './watch-history.controller';
import watchHistoryTestData from './watch-history.test.data';
import { User } from 'src/entities/users.entity';
import { WatchHistoryService } from './watch-history.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CanActivate } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

describe('WatchHistoryController', () => {
  let controller: WatchHistoryController;

  const mockService = {
    getWatchHistory: jest.fn((customer: User) => {
      const data = watchHistoryTestData.getWatchHistoryOfCustomer(customer.id);
      return {
        count: data.length,
        rows: data,
      };
    }),
    watchMovie: jest.fn(),
  };

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchHistoryController],
      providers: [WatchHistoryService],
    })
      .overrideProvider(WatchHistoryService)
      .useValue(mockService)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<WatchHistoryController>(WatchHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get watch history of customer', async () => {
    const customer = watchHistoryTestData.customers[0];
    const data = watchHistoryTestData.getWatchHistoryOfCustomer(customer.id);
    const request = { user: customer } as FastifyRequest;
    expect(await controller.watchHistory(request)).toEqual({
      count: data.length,
      rows: data,
    });
  });

  it('should watch movie', async () => {
    const customer = watchHistoryTestData.customers[0];
    const request = { user: customer } as FastifyRequest;
    expect(
      await controller.watchMovie(
        {
          ticketId: '1',
        },
        request,
      ),
    ).toEqual(undefined);
  });
});
