import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDataDto } from './dto/register-data.dto';
import { compareSync, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, AccessTokenPayload } from 'src/shared/types/auth.types';
import { LoginDto } from './dto/login.dto';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

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
      throw new ServerError(ServerErrorType.USER_CREDENTIALS_ARE_WRONG);
    }

    if (user.password !== user.passwordConfirmation) {
      throw new ServerError(
        ServerErrorType.PASSWORD_AND_CONFIRMATION_DO_NOT_MATCH,
      );
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
      throw new ServerError(ServerErrorType.AN_UNKNOWN_ERROR_IS_OCCURRED);
    }
  }

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.getByUsername(username, true);
      if (!user) {
        throw new ServerError(ServerErrorType.USER_CREDENTIALS_ARE_WRONG);
      }

      const isMatch: boolean = compareSync(password, user.password);
      if (!isMatch) {
        throw new ServerError(ServerErrorType.USER_CREDENTIALS_ARE_WRONG);
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new ServerError(ServerErrorType.USER_CREDENTIALS_ARE_WRONG);
    }
  }

  async login(dto: LoginDto): Promise<AccessToken> {
    const user = await this.validateUser(dto.username, dto.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: AccessTokenPayload = {
      username: user.username,
      id: user.id,
    };
    return { token: this.jwtService.sign(payload) };
  }
}
