import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/entities/roles.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { UserRoles } from 'src/shared/enums/roles.enum';

import rolesSeeds from '../../../.database/seeds/roles.json';
import { SetRoleDto } from './dto/set-role.dto';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private model: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(UserRole) private userRolesModel: typeof UserRole,
  ) {}

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
    const isFirstUser = (await this.model.count()) === 0;

    const newUser = await this.model.create(userData);
    let roles = await this.roleModel.findAll();

    // If roles table is empty, create roles from seeders
    if (roles.length === 0) {
      roles = await this.roleModel.bulkCreate(rolesSeeds);
    }

    if (isFirstUser) {
      // If its first user to register, set his/her role as manager
      const role = roles.find((o) => o.name === UserRoles.Manager);

      if (role) {
        await this.userRolesModel.create({
          userId: newUser.id,
          roleId: role.id,
        });
      }
    } else {
      // else set his/her role as customer
      const role = roles.find((o) => o.name === UserRoles.Customer);

      if (role) {
        await this.userRolesModel.create({
          userId: newUser.id,
          roleId: role.id,
        });
      }
    }
    return newUser;
  }

  async setRole(dto: SetRoleDto) {
    const user = await this.model.findByPk(dto.userId);

    if (!user) {
      throw new ServerError(ServerErrorType.NOT_FOUND, 'User');
    }

    const role = await this.roleModel.findByPk(dto.roleId);

    if (!role) {
      throw new ServerError(ServerErrorType.NOT_FOUND, 'Role');
    }

    // TODO Find a better approach then deleting existing
    await this.userRolesModel.destroy({ where: { userId: user.id } });

    await this.userRolesModel.create({
      userId: user.id,
      roleId: role.id,
    });

    return;
  }

  async getRoles() {
    return this.roleModel.findAll();
  }

  async getUsers() {
    return this.model.findAll({
      attributes: ['id', 'username', 'age'],
      include: [
        {
          model: Role,
        },
      ],
    });
  }
}
