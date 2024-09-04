import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsUUID } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsUUID('4')
  readonly id: string;
}
