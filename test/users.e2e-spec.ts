import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseTestSqliteConfig from 'src/shared/configs/database.test.sqlite.config';
import { CanActivate, HttpStatus } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/roles.entity';
import { UsersModule } from 'src/modules/users/users.module';
import usersTestData from 'src/modules/users/users.test.data';
import { SetRoleDto } from 'src/modules/users/dto/set-role.dto';

describe('Users Controller (e2e)', () => {
  let app: NestFastifyApplication;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          databaseTestSqliteConfig([User, Role, UserRole]),
        ),
        UsersModule,
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await User.bulkCreate(usersTestData.users);
    await Role.bulkCreate(usersTestData.roles);
    await UserRole.bulkCreate(usersTestData.userRoles);
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  it('/users (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/users',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(HttpStatus.OK);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(
          usersTestData.users.map((user) => {
            const data = usersTestData.getRolesIncludedUser(user.id);
            return {
              ...data,
              roles: data.roles.map((entry) => {
                return {
                  ...entry,
                  UserRole: {
                    roleId: entry.id,
                    userId: data.id,
                  },
                };
              }),
            };
          }),
        );
      });
  });

  it('/users/roles (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/users/roles',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(HttpStatus.OK);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual(usersTestData.roles);
      });
  });

  it('/users/role (PATCH)', () => {
    const dto: SetRoleDto = {
      userId: usersTestData.users[1].id, // Customer user
      roleId: usersTestData.roles[0].id, // Make him Manager
    };
    return app
      .inject({
        method: 'PATCH',
        url: '/users/role',
        body: dto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(HttpStatus.OK);
      });
  });
});
