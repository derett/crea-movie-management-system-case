import { IsInt, IsString, Min } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly name: string;

  @IsInt()
  @Min(7)
  readonly ageRestriction: number;
}
