import { Injectable } from '@nestjs/common';

import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

import { InjectModel } from '@nestjs/sequelize';
import { pick } from 'lodash';
import { Movie } from 'src/entities/movie.entity';

@Injectable()
export class MoviesService {
  private readonly updateAttributtes: Partial<keyof Movie>[] = [
    'name',
    'ageRestriction',
  ];

  constructor(@InjectModel(Movie) private model: typeof Movie) {}

  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.model.create(createMovieDto);
  }

  findAll(): Promise<Movie[]> {
    return this.model.findAll();
  }

  findOne(id: string): Promise<Movie> {
    return this.model.findByPk(id);
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
