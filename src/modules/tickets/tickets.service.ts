import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from 'src/entities/movie.entity';
import { Session } from 'src/entities/session.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { User } from 'src/entities/users.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket) private ticketModel: typeof Ticket,
    @InjectModel(Session) private sessionModel: typeof Session,
  ) {}

  private checkAge(customerAge: number, movie: Movie) {
    if (!movie.ageRestriction || customerAge >= movie.ageRestriction) {
      return;
    }

    throw new ServerError(
      ServerErrorType.AGE_RESTRICTION,
      movie.ageRestriction.toString(),
    );
  }

  async buyTicket(dto: BuyTicketDto, customer: User): Promise<Ticket> {
    const session = await this.sessionModel.findByPk(dto.sessionId, {
      include: [
        {
          model: Movie,
        },
      ],
    });

    if (!session) {
      throw new ServerError(ServerErrorType.NOT_FOUND, 'Session');
    }

    this.checkAge(customer.age, session.movie);

    return this.ticketModel.create({
      sessionId: session.id,
      customerId: customer.id,
    });
  }
}
