import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @ApiProperty()
  @IsUUID('4')
  readonly id: string;
}
