import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseTestSqliteConfig from 'src/shared/configs/database.test.sqlite.config';
import ticketsTestData from 'src/modules/tickets/tickets.test.data';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { TimeSlotsModule } from 'src/modules/time-slots/time-slots.module';

describe('TimeSlotsController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(databaseTestSqliteConfig([TimeSlot])),
        TimeSlotsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await TimeSlot.bulkCreate([ticketsTestData.timeSlot]);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/time-slots (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/time-slots',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);

        [ticketsTestData.timeSlot].forEach((timeSlot) => {
          expect(resultObj).toEqual(
            expect.arrayContaining([expect.objectContaining(timeSlot)]),
          );
        });
      });
  });
});
