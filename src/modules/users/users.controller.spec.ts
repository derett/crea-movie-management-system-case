import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import usersTestData from './users.test.data';
import { SetRoleDto } from './dto/set-role.dto';
import { CanActivate } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;

  const mockRolesGuard: CanActivate = { canActivate: jest.fn(() => true) };

  const mockService = {
    getUsers: jest.fn(() => usersTestData.users),
    getRoles: jest.fn(() => usersTestData.roles),
    setRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockService)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', async () => {
    expect(await controller.getUsers()).toEqual(usersTestData.users);
  });

  it('should find all roles', async () => {
    expect(await controller.getRoles()).toEqual(usersTestData.roles);
  });

  it('should set role', async () => {
    expect(
      await controller.setRole(usersTestData.userRoles[0] as SetRoleDto),
    ).toBeUndefined();
  });
});
