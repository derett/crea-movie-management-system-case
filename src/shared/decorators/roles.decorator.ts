import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/shared/enums/roles.enum';

export const RolesDec = (...roles: UserRoles[]) => SetMetadata('roles', roles);
