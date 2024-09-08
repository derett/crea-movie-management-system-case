import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  readonly date: string;

  @ApiProperty()
  @IsString()
  readonly timeSlotId: string;

  @ApiProperty()
  @IsString()
  readonly roomNumber: string;

  @ApiProperty()
  @IsString()
  readonly movieId: string;
}
