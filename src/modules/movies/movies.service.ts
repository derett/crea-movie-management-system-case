import { Injectable } from '@nestjs/common';

import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

import { InjectModel } from '@nestjs/sequelize';
import { pick } from 'lodash';
import { Movie } from 'src/entities/movie.entity';
import { Includeable } from 'sequelize';
import { Session } from 'src/entities/session.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class MoviesService {
  private readonly updateAttributtes: Partial<keyof Movie>[] = [
    'name',
    'ageRestriction',
  ];

  private readonly includeSessions: Includeable[] = [
    {
      model: Session,
      separate: true,
      include: [
        {
          model: TimeSlot,
        },
        {
          model: Room,
        },
      ],
    },
  ];

  constructor(@InjectModel(Movie) private model: typeof Movie) {}

  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.model.create(createMovieDto);
  }

  // TODO Add filtering, sorting etc.
  findAll(): Promise<Movie[]> {
    return this.model.findAll();
  }

  findOne(id: string): Promise<Movie> {
    return this.model.findByPk(id, { include: [...this.includeSessions] });
  }

  async update(updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const [, [entity]] = await this.model.update(
      pick(updateMovieDto, this.updateAttributtes),
      {
        where: { id: updateMovieDto.id },
        returning: true,
      },
    );
    return entity;
  }

  async delete(id: string): Promise<void> {
    const movie = await this.findOne(id);
    await movie.destroy();
  }
}
