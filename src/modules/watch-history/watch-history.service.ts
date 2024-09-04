import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from 'src/entities/ticket.entity';
import { WatchHistory } from 'src/entities/watch-history.entity';
import { WatchMovieDto } from './dto/watch-movie.dto';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';
import { Session } from 'src/entities/session.entity';
import { Movie } from 'src/entities/movie.entity';
import { User } from 'src/entities/users.entity';
import { WhereOptions } from 'sequelize';
import { Room } from 'src/entities/room.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';

@Injectable()
export class WatchHistoryService {
  constructor(
    @InjectModel(Ticket) private ticketModel: typeof Ticket,
    @InjectModel(WatchHistory) private watchHistoryModel: typeof WatchHistory,
  ) {}

  async getWatchHistory(
    customer?: User,
  ): Promise<{ rows: WatchHistory[]; count: number }> {
    const whereClause: WhereOptions<WatchHistory> = {};

    if (customer) {
      whereClause.customerId = customer.id;
    }

    return this.watchHistoryModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Movie,
        },
        {
          model: Session,
          include: [
            {
              model: TimeSlot,
            },
            {
              model: Room,
            },
          ],
        },
      ],
    });
  }

  async watchMovie(dto: WatchMovieDto, customer: User): Promise<void> {
    const ticket = await this.ticketModel.findByPk(dto.ticketId, {
      include: [
        {
          model: Session,
          include: [
            {
              model: Movie,
            },
          ],
        },
      ],
    });

    if (!ticket) {
      throw new ServerError(ServerErrorType.NOT_FOUND, 'Ticket');
    }
    if (!ticket.session) {
      throw new ServerError(ServerErrorType.NOT_FOUND, 'Session');
    }
    if (!ticket.session.movie) {
      throw new ServerError(ServerErrorType.NOT_FOUND, 'Movie');
    }

    if (ticket.customerId !== customer.id) {
      throw new ServerError(ServerErrorType.INVALID_TICKET);
    }

    await this.watchHistoryModel.create({
      movieId: ticket.session.movie.id,
      sessionId: ticket.session.id,
      customerId: customer.id,
    });
  }
}
