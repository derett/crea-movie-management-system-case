import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/sequelize';
import { Movie } from 'src/entities/movie.entity';
import moviesTestData from './movies.test.data';
import { CreateMovieDto } from './dto/create-movie.dto';
import { v4 } from 'uuid';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockModel = {
    findAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(moviesTestData.movies)),
    findByPk: jest
      .fn()
      .mockImplementation((id: string, includeSession = false) => {
        if (!includeSession) {
          return Promise.resolve({
            ...moviesTestData.movies.find((o) => o.id === id),
            destroy: jest
              .fn()
              .mockImplementation(() => Promise.resolve(undefined)),
            save: jest
              .fn()
              .mockImplementation(() => Promise.resolve(undefined)),
          });
        } else {
          return Promise.resolve({
            ...moviesTestData.movies.find((o) => o.id === id),
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
    create: jest.fn().mockImplementation((dto: CreateMovieDto) => {
      return Promise.resolve({
        id: v4(),
        ...dto,
      });
    }),
    update: jest
      .fn()
      .mockImplementation((dto: UpdateMovieDto) => Promise.resolve(dto)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should find all', async () => {
    expect(await service.findAll()).toEqual(moviesTestData.movies);
  });

  it('should find one', async () => {
    const item = moviesTestData.pickOne;
    expect(await service.findOne(item.id)).toEqual(
      expect.objectContaining(item),
    );
  });

  it('should create one', async () => {
    const newContent = moviesTestData.randContent;

    expect(await service.create(newContent)).toEqual({
      id: expect.any(String),
      ...newContent,
    });
  });

  it('should return same entity', async () => {
    const org = moviesTestData.pickOne;
    const updateContent = {
      id: org.id,
    };

    const data = await service.update(updateContent);
    expect(data).toEqual(expect.objectContaining(org));
  });

  it('should update one', async () => {
    const updateContent = {
      id: moviesTestData.pickOne.id,
      ...moviesTestData.randContent,
    };
    expect(await service.update(updateContent)).toEqual(
      expect.objectContaining(updateContent),
    );
  });

  it('should delete one', async () => {
    const item = moviesTestData.pickOne;
    expect(await service.delete(item.id)).toBeUndefined();
  });
});
