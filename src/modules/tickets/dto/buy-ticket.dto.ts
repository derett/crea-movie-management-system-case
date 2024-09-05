import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class BuyTicketDto {
  @ApiProperty()
  @IsUUID('4')
  readonly sessionId: string;
}
