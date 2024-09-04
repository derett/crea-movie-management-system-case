import { IsUUID } from 'class-validator';

export class WatchMovieDto {
  @IsUUID('4')
  readonly ticketId: string;
}
