const timeSlots = require('../seeds/time-slots.json');
const { v4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkDelete('TimeSlots', null, {});

    await queryInterface.bulkInsert(
      'TimeSlots',
      timeSlots.map((o) => {
        return {
          ...o,
          id: v4(),
        };
      }),
    );
  },
  down: async () => {},
};
