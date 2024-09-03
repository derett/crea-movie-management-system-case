import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../enums/roles.enum';
import { User } from 'src/entities/users.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    const userEntity = await this.usersService.getByUsername(
      user.username,
      true,
    );

    return (
      userEntity &&
      roles.some((role) =>
        userEntity.roles.some((userRole) => userRole.name === role),
      )
    );
  }
}
