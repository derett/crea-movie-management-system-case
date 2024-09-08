import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { v4 } from 'uuid';
import ticketsTestData from '../tickets/tickets.test.data';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { faker } from '@faker-js/faker';
import { SessionsService } from './sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  const mockService = {
    findAll: jest.fn(() => ticketsTestData.sessions),
    findOne: jest.fn((id: string) =>
      ticketsTestData.sessions.find((o) => o.id === id),
    ),
    create: jest.fn((dto: CreateSessionDto) => {
      return {
        id: v4(),
        ...dto,
      };
    }),
    update: jest.fn((dto: UpdateSessionDto) => {
      return {
        ...ticketsTestData.sessions.find((o) => o.id === dto.id),
        ...dto,
      };
    }),
    delete: jest.fn(() => undefined),
  };

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionsService],
    })
      .overrideProvider(SessionsService)
      .useValue(mockService)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    expect(await controller.findAll()).toEqual(ticketsTestData.sessions);
  });

  it('should find one', async () => {
    const item = ticketsTestData.sessions[0];
    expect(await controller.findOne(item.id)).toEqual(item);
  });

  it('should create one', async () => {
    const dto: CreateSessionDto = {
      date: '123',
      timeSlotId: faker.string.uuid(),
      roomNumber: '1',
      movieId: faker.string.uuid(),
    };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(String),
      ...dto,
    });
  });

  it('should update one', async () => {
    const item = ticketsTestData.sessions[0];
    const newItem: UpdateSessionDto = {
      id: item.id,
      date: '123',
      timeSlotId: faker.string.uuid(),
      roomNumber: '1',
      movieId: faker.string.uuid(),
    };
    expect(await controller.update(newItem)).toEqual({
      ...newItem,
    });
  });

  it('should delete one', async () => {
    const item = ticketsTestData.sessions[0];
    expect(await controller.remove(item.id)).toBeUndefined();
  });
});
