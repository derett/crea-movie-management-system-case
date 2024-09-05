import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsInt()
  @Min(7)
  readonly ageRestriction: number;
}
