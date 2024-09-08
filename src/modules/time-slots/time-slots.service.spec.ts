import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotsService } from './time-slots.service';
import ticketsTestData from '../tickets/tickets.test.data';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { getModelToken } from '@nestjs/sequelize';

describe('TimeSlotsService', () => {
  let service: TimeSlotsService;

  const mockModel = {
    findAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve([ticketsTestData.timeSlot])),
    bulkCreate: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeSlotsService,
        {
          provide: getModelToken(TimeSlot),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<TimeSlotsService>(TimeSlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all', async () => {
    expect(await service.findAll()).toEqual([ticketsTestData.timeSlot]);
  });
});
