import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty()
  @IsUUID('4')
  readonly id: string;
}
