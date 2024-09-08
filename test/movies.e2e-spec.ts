import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MoviesModule } from 'src/modules/movies/movies.module';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseTestSqliteConfig from 'src/shared/configs/database.test.sqlite.config';
import { Movie } from 'src/entities/movie.entity';
import { Session } from 'src/entities/session.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { Room } from 'src/entities/room.entity';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import moviesTestData from 'src/modules/movies/movies.test.data';

describe('MoviesController (e2e)', () => {
  let app: NestFastifyApplication;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          databaseTestSqliteConfig([Movie, Session, TimeSlot, Room]),
        ),
        MoviesModule,
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

    await Movie.bulkCreate(moviesTestData.movies);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/movies (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/movies',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);

        moviesTestData.movies.forEach((movie) => {
          expect(resultObj).toEqual(
            expect.arrayContaining([expect.objectContaining(movie)]),
          );
        });
      });
  });

  it('/movies/:id (GET)', () => {
    const pickOne = moviesTestData.pickOne;
    return app
      .inject({
        method: 'GET',
        url: `/movies/${pickOne.id}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(expect.objectContaining(pickOne));
      });
  });

  it('/movies (POST)', () => {
    const newContent = moviesTestData.randContent;
    return app
      .inject({
        method: 'POST',
        url: `/movies`,
        body: newContent,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(201);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(expect.objectContaining(newContent));
      });
  });

  it('/movies (PATCH)', () => {
    const pickOne = moviesTestData.pickOne;
    const newContent = {
      ...moviesTestData.randContent,
      id: pickOne.id,
    };

    return app
      .inject({
        method: 'PATCH',
        url: `/movies`,
        body: newContent,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(expect.objectContaining(newContent));
      });
  });

  it('/movies (DELETE)', () => {
    const pickOne = moviesTestData.pickOne;

    return app
      .inject({
        method: 'DELETE',
        url: `/movies/${pickOne.id}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
      });
  });
});
