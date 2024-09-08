import { omit } from 'lodash';
import { Role } from 'src/entities/roles.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/users.entity';

const roles: Partial<Role>[] = [
  {
    id: '72b347f1-8a35-46ca-b23a-9ecef16c0b31',
    name: 'manager',
  },
  {
    id: '9cc42878-1f25-40a7-9122-965392da69be',
    name: 'customer',
  },
];

const users: Partial<User>[] = [
  {
    id: '439e7579-73c2-4de5-9a23-4013001fa579',
    username: 'manager1',
    password: '123',
    age: 20,
  },
  {
    id: '0ec07a28-63bd-4102-86c5-c9d9ac2b42c4',
    username: 'customer1',
    password: '123',
    age: 20,
  },
];

const userRoles: Partial<UserRole>[] = [
  {
    userId: users[0].id,
    roleId: roles[0].id,
  },
  {
    userId: users[1].id,
    roleId: roles[1].id,
  },
];

const getRolesIncludedUser = (userId: string) => {
  const user = users.find((o) => o.id === userId);

  if (user) {
    const userRolesList = userRoles.filter((o) => o.userId === user.id);

    const roleList: Partial<Role>[] = [];
    userRolesList.forEach((entry) => {
      const role = roles.find((o) => o.id === entry.roleId);

      if (role) {
        roleList.push(role);
      }
    });

    return {
      ...omit(user, 'password'),
      roles: roleList,
    };
  }
};

export default {
  users,
  roles,
  userRoles,
  getRolesIncludedUser,
};
