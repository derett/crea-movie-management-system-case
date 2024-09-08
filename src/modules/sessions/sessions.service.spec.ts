import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from 'src/entities/session.entity';
import ticketsTestData from '../tickets/tickets.test.data';
import { getModelToken } from '@nestjs/sequelize';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

describe('SessionsService', () => {
  let service: SessionsService;

  const mockModel = {
    findAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(ticketsTestData.sessions)),
    findByPk: jest
      .fn()
      .mockImplementation((id: string, includeSession = false) => {
        if (!includeSession) {
          return Promise.resolve({
            ...ticketsTestData.sessions.find((o) => o.id === id),
            destroy: jest
              .fn()
              .mockImplementation(() => Promise.resolve(undefined)),
            save: jest
              .fn()
              .mockImplementation(() => Promise.resolve(undefined)),
          });
        } else {
          return Promise.resolve({
            ...ticketsTestData.sessions.find((o) => o.id === id),
            destroy: jest
              .fn()
              .mockImplementation(() => Promise.resolve(undefined)),
            save: jest
              .fn()
              .mockImplementation(() => Promise.resolve(undefined)),
            sessions: [],
          });
        }
      }),
    create: jest.fn().mockImplementation((dto: CreateSessionDto) => {
      return Promise.resolve({
        id: v4(),
        ...dto,
      });
    }),
    update: jest
      .fn()
      .mockImplementation((dto: UpdateSessionDto) => Promise.resolve(dto)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getModelToken(Session),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all', async () => {
    expect(await service.findAll()).toEqual(ticketsTestData.sessions);
  });

  it('should find one', async () => {
    const item = ticketsTestData.sessions[0];
    expect(await service.findOne(item.id)).toEqual(
      expect.objectContaining(item),
    );
  });

  it('should create one', async () => {
    const newContent: CreateSessionDto = {
      date: '123',
      timeSlotId: faker.string.uuid(),
      roomNumber: '1',
      movieId: faker.string.uuid(),
    };

    expect(await service.create(newContent)).toEqual({
      id: expect.any(String),
      ...newContent,
    });
  });

  it('should return same entity', async () => {
    const org = ticketsTestData.sessions[0];
    const updateContent = {
      id: org.id,
    };

    const data = await service.update(updateContent);
    expect(data).toEqual(expect.objectContaining(org));
  });

  it('should update one', async () => {
    const updateContent = {
      id: ticketsTestData.sessions[0].id,
      timeSlotId: faker.string.uuid(),
      roomNumber: '1',
      movieId: faker.string.uuid(),
    };
    expect(await service.update(updateContent)).toEqual(
      expect.objectContaining(updateContent),
    );
  });

  it('should delete one', async () => {
    const item = ticketsTestData.sessions[0];
    expect(await service.delete(item.id)).toBeUndefined();
  });
});
