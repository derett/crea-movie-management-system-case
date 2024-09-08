import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

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

  @ApiProperty()
  @IsNumber()
  @Min(3)
  @Max(120)
  readonly age: number;
}
