import { faker } from '@faker-js/faker';

import { CreateMovieDto } from './dto/create-movie.dto';

function createRandomMovie(): CreateMovieDto & { id: string } {
  return {
    id: faker.string.uuid(),
    ...randomMovieData(),
  };
}

function randomMovieData(): CreateMovieDto {
  return {
    name: faker.lorem.words(3),
    ageRestriction: faker.number.int({ min: 13, max: 20 }),
  };
}

const movies = faker.helpers.multiple(createRandomMovie, { count: 5 });

export default {
  movies,
  randContent: randomMovieData(),
  pickOne: movies[Math.floor(Math.random() * movies.length)],
};
