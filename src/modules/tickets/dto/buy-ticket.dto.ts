import { IsUUID } from 'class-validator';

export class BuyTicketDto {
  @IsUUID('4')
  readonly sessionId: string;
}
