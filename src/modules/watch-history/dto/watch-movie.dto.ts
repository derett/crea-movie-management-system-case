import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class WatchMovieDto {
  @ApiProperty()
  @IsUUID('4')
  readonly ticketId: string;
}
