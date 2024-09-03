const { v4 } = require('uuid');

const dateToEpoch = (date) => {
  return date.setHours(0, 0, 0, 0);
};

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const getDays = () => {
  const today = dateToEpoch(new Date());
  return [addDays(today, 3), addDays(today, 4), addDays(today, 5)];
};

const pickRandom = (list) => {
  return list[Math.floor(Math.random() * (list.length - 1))];
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sessions', null, {});

    const [timeSlots] = await queryInterface.sequelize.query(
      'SELECT * FROM "TimeSlots"',
    );
    const [movies] = await queryInterface.sequelize.query(
      'SELECT * FROM "Movies" LIMIT 10',
    );
    const [rooms] = await queryInterface.sequelize.query(
      'SELECT * FROM "Rooms"',
    );

    const sessions = [];
    const days = getDays();

    for (let i = 0; i < 30; i++) {
      const timeSlotId = pickRandom(timeSlots).id;
      const roomNumber = pickRandom(rooms).roomNumber;
      const movieId = pickRandom(movies).id;
      const date = pickRandom(days).toDateString();

      if (
        sessions.some(
          (session) =>
            session.timeSlotId === timeSlotId &&
            session.roomNumber === roomNumber &&
            session.date === date,
        )
      ) {
        i = i - 1;
      } else {
        sessions.push({
          id: v4(),
          date,
          timeSlotId,
          roomNumber,
          movieId,
        });
      }
    }

    await queryInterface.bulkInsert('Sessions', sessions);
  },
  down: async () => {},
};
