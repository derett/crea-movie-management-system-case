import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseTestSqliteConfig from 'src/shared/configs/database.test.sqlite.config';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/entities/user-role.entity';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/users.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/shared/configs';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDataDto } from 'src/modules/auth/dto/register-data.dto';
import { pick } from 'lodash';
import { AuthModule } from 'src/modules/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(
          databaseTestSqliteConfig([User, Role, UserRole]),
        ),
        AuthModule,
        UsersModule,
        JwtModule.registerAsync({
          useFactory: async () => ({
            secret: envConfig.jwtSecret,
            signOptions: {
              expiresIn: envConfig.jwtExpireSecs,
            },
          }),
        }),
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
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {});

  const registerDto: RegisterDataDto = {
    username: 'ksaylam',
    password: '123',
    passwordConfirmation: '123',
    age: 28,
  };

  it('/auth/register (POST)', () => {
    return app
      .inject({
        method: 'POST',
        url: `/auth/register`,
        body: registerDto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(201);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual({
          ...pick(registerDto, 'username', 'age'),
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
  });

  it('/auth/login (POST)', () => {
    const loginDto: LoginDto = {
      username: registerDto.username,
      password: registerDto.password,
    };
    return app
      .inject({
        method: 'POST',
        url: '/auth/login',
        body: loginDto,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        const resultObj = JSON.parse(result.body);
        expect(resultObj).toEqual({
          token: expect.any(String),
        });
      });
  });
});
