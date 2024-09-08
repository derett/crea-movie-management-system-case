import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import ticketsTestData from '../tickets/tickets.test.data';
import { getModelToken } from '@nestjs/sequelize';
import { Room } from 'src/entities/room.entity';

describe('RoomsService', () => {
  let service: RoomsService;

  const mockModel = {
    findAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(ticketsTestData.rooms)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getModelToken(Room),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all', async () => {
    expect(await service.findAll()).toEqual(ticketsTestData.rooms);
  });
});
