const { hash } = require('bcrypt');
const roles = require('../seeds/roles.json');
const users = require('../seeds/users.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('Users', null, {});

    const usersUpdated = await Promise.all(
      [...users].map(async ({ roles, ...user }) => {
        return {
          ...user,
          password: await hash(user.password, 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );

    await queryInterface.bulkInsert('Users', usersUpdated);

    const userRoles = [];

    users.forEach((user) => {
      user.roles.forEach((userRole) => {
        const role = roles.find((role) => role.name === userRole);

        if (role) {
          userRoles.push({
            userId: user.id,
            roleId: role.id,
          });
        }
      });
    });

    return queryInterface.bulkInsert('UserRoles', userRoles);
  },
  down: async (queryInterface, Sequelize) => {},
};
