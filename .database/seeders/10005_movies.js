const { v4 } = require('uuid');
const movies = require('../seeds/movies.json');

const ageRestrictions = { R: 17, 'PG-13': 13 };

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkDelete('Movies', null, {});
    await queryInterface.bulkInsert(
      'Movies',
      movies.map((movie) => {
        return {
          id: v4(),
          name: movie.Title,
          ageRestriction: ageRestrictions[movie.Rated] || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );
  },
  down: async () => {},
};
