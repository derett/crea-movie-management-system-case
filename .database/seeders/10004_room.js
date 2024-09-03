const rooms = require('../seeds/rooms.json');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkDelete('Rooms', null, {});
    await queryInterface.bulkInsert('Rooms', rooms);
  },
  down: async () => {},
};
