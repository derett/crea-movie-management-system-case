import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import authTestData from './auth.test.data';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { omit } from 'lodash';
import { faker } from '@faker-js/faker';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';
import { RegisterDataDto } from './dto/register-data.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockUsersService = {
      getByUsername: jest
        .fn()
        .mockImplementation((username: string) =>
          Promise.resolve(
            authTestData.users.find((o) => o.username === username),
          ),
        ),
      create: jest
        .fn()
        .mockImplementation((dto: CreateUserDto) =>
          Promise.resolve({ ...dto, id: faker.string.uuid() }),
        ),
    };

    const mockJwtService = {
      sign: jest.fn().mockImplementation(() => faker.string.alphanumeric(10)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should throw error when password mismatch', async () => {
    let dto = authTestData.randContent;
    dto = {
      ...dto,
      passwordConfirmation: dto.password + 'xyz',
    };

    let thrownError;

    try {
      await service.register(dto);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new ServerError(ServerErrorType.PASSWORD_AND_CONFIRMATION_DO_NOT_MATCH),
    );
  });

  it('should register one correctly', async () => {
    let dto: RegisterDataDto;
    const allData = authTestData.users;

    // To ensure random content didn't select an already existing one.
    while (true) {
      dto = authTestData.randContent;
      if (!allData.some((user) => user.username === dto.username)) {
        break;
      }
    }

    expect(await service.register(dto)).toEqual(
      expect.objectContaining(omit(dto, 'password', 'passwordConfirmation')),
    );
  });

  it('should throw error when username already exists', async () => {
    const dto = authTestData.pickOne;

    let thrownError;

    try {
      await service.register(dto);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(
      new ServerError(ServerErrorType.USER_CREDENTIALS_ARE_WRONG),
    );
  });
});
