import { User } from 'src/entities/users.entity';

import { faker } from '@faker-js/faker';
import { Session } from 'src/entities/session.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { Room } from 'src/entities/room.entity';
import { Movie } from 'src/entities/movie.entity';

const customer: Partial<User> = {
  id: 'd5b3c71d-466a-4550-b69d-3d6653d3bc07',
  username: faker.internet.userName(),
  password: '123',
  age: 15,
};

const timeSlot: Partial<TimeSlot> = {
  id: '8ea635bb-7011-4baf-9ba3-bfe37adfefa9',
  timeSlot: '10.00 - 12.00',
};

const rooms: Partial<Room>[] = [
  {
    roomNumber: '1',
  },
  {
    roomNumber: '2',
  },
];

const movies: Partial<Movie>[] = [
  {
    id: '003f81da-60d7-4625-9521-10f76b6fb767',
    name: 'Movie 1',
    ageRestriction: 20,
  },
  {
    id: 'ccdd67de-1908-4c24-a958-4bc5ce3ac8e2',
    name: 'Movie 2',
    ageRestriction: 12,
  },
];

const sessions: Partial<Session>[] = [
  {
    id: 'b238d69e-81f0-4439-9d4a-ab414dd89ff8',
    date: '2024-09-07 03:00:00+03',
    timeSlotId: timeSlot.id,
    roomNumber: rooms[0].roomNumber,
    movieId: movies[0].id,
  },
  {
    id: 'b2ed58b2-2e85-4e93-8825-fabe60940ac0',
    date: '2024-09-07 03:00:00+03',
    timeSlotId: timeSlot.id,
    roomNumber: rooms[1].roomNumber,
    movieId: movies[1].id,
  },
];

export default {
  customer,
  sessions,
  movies,
  timeSlot,
  rooms,
};
