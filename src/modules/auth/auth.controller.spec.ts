import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginDto } from './dto/login.dto';
import { faker } from '@faker-js/faker';
import { RegisterDataDto } from './dto/register-data.dto';
import { AuthService } from './auth.service';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { pick } from 'lodash';

describe('AuthController', () => {
  let controller: AuthController;

  const mockService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: jest.fn((_dto: LoginDto) => {
      return {
        token: faker.string.alphanumeric(5),
      };
    }),
    register: jest.fn((dto: RegisterDataDto) => pick(dto, 'username', 'age')),
  };
  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockService)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    expect(
      await controller.login({ password: '123', username: 'abc' }),
    ).toEqual({
      token: expect.any(String),
    });
  });

  it('should register', async () => {
    const dto = {
      username: 'abc',
      age: 1,
      password: '123',
      passwordConfirmation: '123',
    };
    expect(await controller.register(dto)).toEqual(
      pick(dto, 'username', 'age'),
    );
  });
});
