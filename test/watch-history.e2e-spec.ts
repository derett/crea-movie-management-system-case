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
import { CanActivate, HttpStatus } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/entities/user-role.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/roles.entity';
import ticketsTestData from 'src/modules/tickets/tickets.test.data';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterDataDto } from 'src/modules/auth/dto/register-data.dto';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { DataModule } from 'src/modules/data/data.module';
import { UsersModule } from 'src/modules/users/users.module';
import { WatchHistory } from 'src/entities/watch-history.entity';
import { WatchMovieDto } from 'src/modules/watch-history/dto/watch-movie.dto';
import watchHistoryTestData from 'src/modules/watch-history/watch-history.test.data';

describe('WatchHistory Controller (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          databaseTestSqliteConfig([
            WatchHistory,
            Ticket,
            Movie,
            Session,
            TimeSlot,
            Room,
            User,
            Role,
            UserRole,
          ]),
        ),
        UsersModule,
        AuthModule,
        DataModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtGuard,
        },
        JwtStrategy,
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

    const authService = moduleFixture.get<AuthService>(AuthService);

    await authService.register({
      ...ticketsTestData.customer,
      passwordConfirmation: ticketsTestData.customer.password,
    } as RegisterDataDto);

    const loginResult = await authService.login({
      username: ticketsTestData.customer.username,
      password: ticketsTestData.customer.password,
    });

    token = loginResult.token;

    await TimeSlot.bulkCreate([ticketsTestData.timeSlot], {
      ignoreDuplicates: true,
    });
    await Room.bulkCreate(ticketsTestData.rooms, { ignoreDuplicates: true });
    await Movie.bulkCreate(ticketsTestData.movies);
    await Session.bulkCreate(ticketsTestData.sessions);

    await User.create(watchHistoryTestData.anotherCustomer);
    const requestingCustomer = await User.findOne({
      where: { username: ticketsTestData.customer.username },
    });

    const tickets = [
      {
        id: 'e9ca898c-038b-4840-880e-19b9dcfc4251',
        sessionId: ticketsTestData.sessions[0].id,
        customerId: requestingCustomer.id,
      },
      {
        id: '9760409e-b126-47fe-a33a-872be7ca9c67',
        sessionId: ticketsTestData.sessions[1].id,
        customerId: requestingCustomer.id,
      },
      {
        id: 'dbb82ac7-2634-40fa-a875-6158ae7ec782',
        sessionId: ticketsTestData.sessions[0].id,
        customerId: watchHistoryTestData.anotherCustomer.id,
      },
    ];

    await Ticket.bulkCreate(tickets);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/watch-history/watch Invalid Ticket (POST)', () => {
    const dto: WatchMovieDto = {
      ticketId: 'dbb82ac7-2634-40fa-a875-6158ae7ec782',
    };
    return app
      .inject({
        method: 'POST',
        url: '/watch-history/watch',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: dto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
  });

  it('/watch-history/watch Own Ticket (POST)', () => {
    const dto: WatchMovieDto = {
      ticketId: 'e9ca898c-038b-4840-880e-19b9dcfc4251',
    };
    return app
      .inject({
        method: 'POST',
        url: '/watch-history/watch',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: dto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(HttpStatus.OK);
      });
  });

  it('/watch-history/watch Own Ticket 2 (POST)', () => {
    const dto: WatchMovieDto = {
      ticketId: '9760409e-b126-47fe-a33a-872be7ca9c67',
    };
    return app
      .inject({
        method: 'POST',
        url: '/watch-history/watch',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: dto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(HttpStatus.OK);
      });
  });

  it('/watch-history/history (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/watch-history/history',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultValue = JSON.parse(result.body);
        expect(resultValue.count).toEqual(2);
        resultValue.rows.forEach((row: WatchHistory) => {
          expect(row).toEqual(
            expect.objectContaining({
              customerId: expect.any(String),
              id: expect.any(String),
              createdAt: expect.any(String),
              movie: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
              session: expect.objectContaining({
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
              }),
              sessionId: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
        });
      });
  });
});
