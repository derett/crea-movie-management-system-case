import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SetRoleDto {
  @ApiProperty()
  @IsUUID(4)
  readonly userId: string;

  @ApiProperty()
  @IsUUID(4)
  readonly roleId: string;
}
