import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDataDto {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly passwordConfirmation: string;
}
