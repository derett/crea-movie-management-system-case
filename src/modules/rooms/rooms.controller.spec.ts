import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import ticketsTestData from '../tickets/tickets.test.data';
import { RoomsService } from './rooms.service';

describe('RoomsController', () => {
  let controller: RoomsController;

  const mockService = {
    findAll: jest.fn(() => ticketsTestData.rooms),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService],
    })
      .overrideProvider(RoomsService)
      .useValue(mockService)
      .compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    expect(await controller.findAll()).toEqual(ticketsTestData.rooms);
  });
});
