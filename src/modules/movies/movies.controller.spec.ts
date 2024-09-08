import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import moviesTestData from './movies.test.data';
import { CreateMovieDto } from './dto/create-movie.dto';
import { v4 } from 'uuid';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockService = {
    findAll: jest.fn(() => moviesTestData.movies),
    findOne: jest.fn((id: string) =>
      moviesTestData.movies.find((o) => o.id === id),
    ),
    create: jest.fn((dto: CreateMovieDto) => {
      return {
        id: v4(),
        ...dto,
      };
    }),
    update: jest.fn((dto: UpdateMovieDto) => {
      return {
        ...moviesTestData.movies.find((o) => o.id === dto.id),
        ...dto,
      };
    }),
    delete: jest.fn(() => undefined),
  };
  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    })
      .overrideProvider(MoviesService)
      .useValue(mockService)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    expect(await controller.findAll()).toEqual(moviesTestData.movies);
  });

  it('should find one', async () => {
    const item = moviesTestData.pickOne;
    expect(await controller.findOne(item.id)).toEqual(item);
  });

  it('should create one', async () => {
    const dto = {
      ageRestriction: 10,
      name: 'Movie 1',
    };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(String),
      ...dto,
    });
  });

  it('should update one', async () => {
    const item = moviesTestData.pickOne;
    const newItem: UpdateMovieDto = {
      id: item.id,
      ageRestriction: 12,
      name: 'Movie Updated',
    };
    expect(await controller.update(newItem)).toEqual({
      ...newItem,
    });
  });

  it('should delete one', async () => {
    const item = moviesTestData.pickOne;
    expect(await controller.remove(item.id)).toBeUndefined();
  });
});
