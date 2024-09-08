import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotsController } from './time-slots.controller';
import ticketsTestData from '../tickets/tickets.test.data';
import { TimeSlotsService } from './time-slots.service';

describe('TimeSlotsController', () => {
  let controller: TimeSlotsController;

  const mockService = {
    findAll: jest.fn(() => [ticketsTestData.timeSlot]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSlotsController],
      providers: [TimeSlotsService],
    })
      .overrideProvider(TimeSlotsService)
      .useValue(mockService)
      .compile();

    controller = module.get<TimeSlotsController>(TimeSlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    expect(await controller.findAll()).toEqual([ticketsTestData.timeSlot]);
  });
});
