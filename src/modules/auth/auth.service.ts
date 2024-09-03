import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDataDto } from './dto/register-data.dto';
import { compareSync, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/users.entity';
import { AccessToken, AccessTokenPayload } from 'src/shared/types/auth.types';

const salt = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: RegisterDataDto) {
    const existingUser = await this.usersService.getByUsername(user.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    if (user.password !== user.passwordConfirmation) {
      throw new BadRequestException('Password confirmation mismatch');
    }

    const hashedPassword = await hash(user.password, salt);

    try {
      const createdUser = await this.usersService.create({
        ...user,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'User with that username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.getByUsername(username, true);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isMatch: boolean = compareSync(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Password does not match');
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(user: User): Promise<AccessToken> {
    const payload: AccessTokenPayload = {
      username: user.username,
      id: user.id,
    };
    return { token: this.jwtService.sign(payload) };
  }
}
