import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.user.username) {
      const user = await this.usersService.getByUsername(request.user.username);
      request.user = user;
      return true;
    } else {
      return false;
    }
  }
}
