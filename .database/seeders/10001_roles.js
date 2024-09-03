const roles = require('../seeds/roles.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
    return queryInterface.bulkInsert('Roles', roles);
  },
  down: (queryInterface, Sequelize) => {},
};
