import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/roles.entity';
import { FindOptions } from 'sequelize';
import { isArray, omit } from 'lodash';
import usersTestData from './users.test.data';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 } from 'uuid';
import { SetRoleDto } from './dto/set-role.dto';
import { UserRole } from 'src/entities/user-role.entity';

describe('UsersService', () => {
  let service: UsersService;

  let mockUsersListCount = usersTestData.users.length;

  const mockUserModel = {
    findAll: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          usersTestData.users.map((user) =>
            usersTestData.getRolesIncludedUser(user.id),
          ),
        ),
      ),
    findOne: jest.fn().mockImplementation((options: FindOptions<User>) => {
      // TODO Fix this ts-ignore
      // @ts-ignore
      const usernameInSearch = options.where?.username;
      if (usernameInSearch) {
        const user = usersTestData.users.find(
          (o) => o.username === usernameInSearch,
        );
        if (isArray(options.include) && options.include.length) {
          return Promise.resolve({
            ...usersTestData.getRolesIncludedUser(user.id),
          });
        } else {
          return Promise.resolve({
            ...usersTestData.users.find((o) => o.id === user.id),
          });
        }
      }
    }),
    findByPk: jest
      .fn()
      .mockImplementation((userId: string) =>
        Promise.resolve(usersTestData.users.find((o) => o.id === userId)),
      ),
    count: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUsersListCount)),
    create: jest.fn().mockImplementation((dto: CreateUserDto) => {
      return Promise.resolve({
        id: v4(),
        ...omit(dto, 'password'),
      });
    }),
  };

  const mockRoleModel = {
    findAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(usersTestData.roles)),
    bulkCreate: jest
      .fn()
      .mockImplementation((roles: Partial<Role>) => Promise.resolve(roles)),
    findByPk: jest
      .fn()
      .mockImplementation((roleId: string) =>
        Promise.resolve(usersTestData.roles.find((o) => o.id === roleId)),
      ),
  };

  const mockUserRoleModel = {
    create: jest.fn().mockImplementation(() => Promise.resolve()),
    destroy: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Role),
          useValue: mockRoleModel,
        },
        {
          provide: getModelToken(UserRole),
          useValue: mockUserRoleModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getByUsername', async () => {
    const user = usersTestData.users[0];
    expect(await service.getByUsername(user.username)).toEqual(
      usersTestData.users[0],
    );
  });

  it('should getByUsername rolesIncluded', async () => {
    const user = usersTestData.users[0];
    expect(await service.getByUsername(user.username, true)).toEqual(
      usersTestData.getRolesIncludedUser(user.id),
    );
  });

  it('should create first User', async () => {
    mockUsersListCount = 0;
    const dto: CreateUserDto = {
      age: 10,
      password: '123',
      username: 'abc',
    };
    expect(await service.create(dto)).toEqual({
      ...omit(dto, 'password'),
      id: expect.any(String),
    });
  });

  it('should create next User', async () => {
    mockUsersListCount = usersTestData.users.length;
    const dto: CreateUserDto = {
      age: 11,
      password: '124',
      username: 'abd',
    };
    expect(await service.create(dto)).toEqual({
      ...omit(dto, 'password'),
      id: expect.any(String),
    });
  });

  it('should set role', async () => {
    const dto: SetRoleDto = usersTestData.userRoles[0] as SetRoleDto;
    expect(await service.setRole(dto)).toBeUndefined();
  });

  it('should get all roles', async () => {
    expect(await service.getRoles()).toEqual(usersTestData.roles);
  });

  it('should get all users', async () => {
    expect(await service.getUsers()).toEqual(
      usersTestData.users.map((o) => usersTestData.getRolesIncludedUser(o.id)),
    );
  });
});
