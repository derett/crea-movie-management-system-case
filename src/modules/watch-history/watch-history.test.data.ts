import { User } from 'src/entities/users.entity';

import { faker } from '@faker-js/faker';
import { Ticket } from 'src/entities/ticket.entity';
import ticketsTestData from '../tickets/tickets.test.data';
import { WatchHistory } from 'src/entities/watch-history.entity';

const anotherCustomer = {
  id: '8c17d15a-cd7b-4f1c-923b-0a64e6ab3b8d',
  username: faker.internet.userName(),
  password: '123',
  age: 23,
};

const customers: Partial<User>[] = [ticketsTestData.customer, anotherCustomer];

const tickets: Partial<Ticket>[] = [
  {
    id: '52750418-8f53-468d-a5af-e93108b0bb41',
    sessionId: 'b238d69e-81f0-4439-9d4a-ab414dd89ff8',
    customerId: 'd5b3c71d-466a-4550-b69d-3d6653d3bc07',
  },
  {
    id: '76762c70-829f-415b-bbd7-86541916bc8c',
    sessionId: 'b238d69e-81f0-4439-9d4a-ab414dd89ff8',
    customerId: '8c17d15a-cd7b-4f1c-923b-0a64e6ab3b8d',
  },
  {
    id: 'a54fa013-8865-4b03-809f-a6921cd68663',
    sessionId: 'b2ed58b2-2e85-4e93-8825-fabe60940ac0',
    customerId: '8c17d15a-cd7b-4f1c-923b-0a64e6ab3b8d',
  },
];

const watchHistory = [
  {
    movieId: ticketsTestData.movies[0].id,
    customerId: customers[0].id,
    sessionId: ticketsTestData.sessions[0].id,
  },
  {
    movieId: ticketsTestData.movies[1].id,
    customerId: customers[0].id,
    sessionId: ticketsTestData.sessions[0].id,
  },
  {
    movieId: ticketsTestData.movies[0].id,
    customerId: customers[1].id,
    sessionId: ticketsTestData.sessions[0].id,
  },
  {
    movieId: ticketsTestData.movies[1].id,
    customerId: customers[1].id,
    sessionId: ticketsTestData.sessions[0].id,
  },
  {
    movieId: ticketsTestData.movies[0].id,
    customerId: customers[0].id,
    sessionId: ticketsTestData.sessions[1].id,
  },
  {
    movieId: ticketsTestData.movies[1].id,
    customerId: customers[0].id,
    sessionId: ticketsTestData.sessions[1].id,
  },
  {
    movieId: ticketsTestData.movies[0].id,
    customerId: customers[1].id,
    sessionId: ticketsTestData.sessions[1].id,
  },
  {
    movieId: ticketsTestData.movies[1].id,
    customerId: customers[1].id,
    sessionId: ticketsTestData.sessions[1].id,
  },
];

const getWatchHistoryOfCustomer = (customerId: string) => {
  return watchHistory
    .filter((o) => o.customerId === customerId)
    .map((history) => {
      const movie = ticketsTestData.movies.find(
        (o) => o.id === history.movieId,
      );

      if (movie) {
        const session = ticketsTestData.sessions.find(
          (o) => o.id === history.sessionId,
        );

        if (session) {
          const timeSlot = ticketsTestData.timeSlot;

          const room = ticketsTestData.rooms.find(
            (o) => o.roomNumber === session.roomNumber,
          );

          if (room && timeSlot) {
            return {
              ...watchHistory,
              movie,
              session: {
                ...session,
                timeSlot,
                room,
              },
            };
          }
        }
      }
    })
    .filter((o) => o !== undefined) as Partial<WatchHistory>[];
};

const getTicketById = (ticketId: string) => {
  const ticket = tickets.find((o) => o.id === ticketId);

  if (ticket) {
    const session = ticketsTestData.sessions.find(
      (o) => o.id === ticket.sessionId,
    );

    if (session) {
      const movie = ticketsTestData.movies.find(
        (o) => o.id === session.movieId,
      );

      if (movie) {
        return {
          ...ticket,
          session: {
            ...session,
            movie,
          },
        };
      }
    }
  }
};

export default {
  watchHistory,
  getWatchHistoryOfCustomer,
  getTicketById,
  customers,
  anotherCustomer,
  tickets,
};
