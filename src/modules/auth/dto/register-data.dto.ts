import { IsString } from 'class-validator';

export class RegisterDataDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly passwordConfirmation: string;
}
