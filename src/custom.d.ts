import { User } from './entities/users.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}
