import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/entities/roles.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private model: typeof User) {}

  async getByUsername(username: string, includeRoles = false): Promise<User> {
    return this.model.findOne({
      where: { username },
      include: includeRoles
        ? [
            {
              model: Role,
            },
          ]
        : undefined,
    });
  }

  async create(userData: CreateUserDto) {
    return await this.model.create(userData);
  }
}
