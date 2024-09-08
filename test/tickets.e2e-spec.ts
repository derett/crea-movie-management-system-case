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
import { BuyTicketDto } from 'src/modules/tickets/dto/buy-ticket.dto';
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

describe('TicketsController (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    // Couldn't figure out how to make JWT Strategy work so that is adds user info to request.user
    // So Imported everything from AppModule except for the database config
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          databaseTestSqliteConfig([
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

    await TimeSlot.bulkCreate([ticketsTestData.timeSlot]);
    await Room.bulkCreate(ticketsTestData.rooms);
    await Movie.bulkCreate(ticketsTestData.movies);
    await Session.bulkCreate(ticketsTestData.sessions);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/tickets/buy Under Age (POST)', () => {
    const dto: BuyTicketDto = {
      sessionId: ticketsTestData.sessions[0].id,
    };
    return app
      .inject({
        method: 'POST',
        url: '/tickets/buy',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: dto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
      });
  });

  it('/tickets/buy Legal Age (POST)', () => {
    const dto: BuyTicketDto = {
      sessionId: ticketsTestData.sessions[1].id,
    };
    return app
      .inject({
        method: 'POST',
        url: '/tickets/buy',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: dto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(201);
      });
  });
});
