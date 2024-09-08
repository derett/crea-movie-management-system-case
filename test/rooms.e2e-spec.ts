import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseTestSqliteConfig from 'src/shared/configs/database.test.sqlite.config';
import { Room } from 'src/entities/room.entity';
import ticketsTestData from 'src/modules/tickets/tickets.test.data';
import { RoomsModule } from 'src/modules/rooms/rooms.module';

describe('RoomsController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(databaseTestSqliteConfig([Room])),
        RoomsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await Room.bulkCreate(ticketsTestData.rooms);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/rooms (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/rooms',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);

        ticketsTestData.rooms.forEach((room) => {
          expect(resultObj).toEqual(
            expect.arrayContaining([expect.objectContaining(room)]),
          );
        });
      });
  });
});
