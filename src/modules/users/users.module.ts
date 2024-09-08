import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/roles.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { UsersController } from './users.controller';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRole])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
