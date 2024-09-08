import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesDec } from 'src/shared/decorators/roles.decorator';
import { SetRoleDto } from './dto/set-role.dto';

@ApiTags('users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @RolesDec(UserRoles.Manager)
  @Get('')
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiBearerAuth()
  @RolesDec(UserRoles.Manager)
  @Get('roles')
  getRoles() {
    return this.usersService.getRoles();
  }

  @ApiBearerAuth()
  @RolesDec(UserRoles.Manager)
  @Patch('role')
  setRole(@Body() dto: SetRoleDto) {
    return this.usersService.setRole(dto);
  }
}
