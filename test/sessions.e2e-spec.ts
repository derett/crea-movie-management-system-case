import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseTestSqliteConfig from 'src/shared/configs/database.test.sqlite.config';
import { Movie } from 'src/entities/movie.entity';
import { Session } from 'src/entities/session.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { Room } from 'src/entities/room.entity';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { SessionsModule } from 'src/modules/sessions/sessions.module';
import ticketsTestData from 'src/modules/tickets/tickets.test.data';
import { CreateSessionDto } from 'src/modules/sessions/dto/create-session.dto';
import { UpdateSessionDto } from 'src/modules/sessions/dto/update-session.dto';

describe('SessionsController (e2e)', () => {
  let app: NestFastifyApplication;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          databaseTestSqliteConfig([Movie, Session, TimeSlot, Room]),
        ),
        SessionsModule,
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await TimeSlot.bulkCreate([ticketsTestData.timeSlot]);
    await Room.bulkCreate(ticketsTestData.rooms);
    await Movie.bulkCreate(ticketsTestData.movies);
    await Session.bulkCreate(ticketsTestData.sessions);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/sessions (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/sessions',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);

        resultObj.forEach((item: Session) => {
          expect(item).toEqual(
            expect.objectContaining({
              date: expect.any(String),
              id: expect.any(String),
              movieId: expect.any(String),
              timeSlotId: expect.any(String),
              roomNumber: expect.any(String),
              timeSlot: {
                id: expect.any(String),
                timeSlot: expect.any(String),
              },
              room: {
                roomNumber: expect.any(String),
              },
              movie: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
            }),
          );
        });
      });
  });

  it('/sessions/:id (GET)', () => {
    const pickOne = ticketsTestData.sessions[0];
    return app
      .inject({
        method: 'GET',
        url: `/sessions/${pickOne.id}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(
          expect.objectContaining({
            date: expect.any(String),
            id: pickOne.id,
            movieId: pickOne.movieId,
            timeSlotId: pickOne.timeSlotId,
            roomNumber: pickOne.roomNumber,
            timeSlot: {
              id: pickOne.timeSlotId,
              timeSlot: expect.any(String),
            },
            room: {
              roomNumber: pickOne.roomNumber,
            },
            movie: expect.objectContaining({
              id: pickOne.movieId,
              name: expect.any(String),
            }),
          }),
        );
      });
  });

  it('/sessions (POST)', () => {
    const newContent: CreateSessionDto = {
      date: '2024-09-07 06:00:00+03',
      movieId: ticketsTestData.movies[0].id,
      roomNumber: ticketsTestData.rooms[1].roomNumber,
      timeSlotId: ticketsTestData.timeSlot.id,
    };
    return app
      .inject({
        method: 'POST',
        url: `/sessions`,
        body: newContent,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(201);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(
          expect.objectContaining({ ...newContent, date: expect.any(String) }),
        );
      });
  });

  it('/sessions Double Book (POST)', () => {
    const newContent: CreateSessionDto = {
      date: '2024-09-07 03:00:00+03',
      movieId: ticketsTestData.movies[0].id,
      roomNumber: ticketsTestData.rooms[0].roomNumber,
      timeSlotId: ticketsTestData.timeSlot.id,
    };
    return app
      .inject({
        method: 'POST',
        url: `/sessions`,
        body: newContent,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(500);
      });
  });

  it('/sessions (PATCH)', () => {
    const pickOne = ticketsTestData.sessions[0];
    const newContent: UpdateSessionDto = {
      id: pickOne.id,
      date: '2024-09-07 03:00:00+03',
      movieId: ticketsTestData.movies[1].id,
    };

    return app
      .inject({
        method: 'PATCH',
        url: `/sessions`,
        body: newContent,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(
          expect.objectContaining({ ...newContent, date: expect.any(String) }),
        );
      });
  });

  it('/sessions (DELETE)', () => {
    const pickOne = ticketsTestData.sessions[0];

    return app
      .inject({
        method: 'DELETE',
        url: `/sessions/${pickOne.id}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
      });
  });
});
