import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccessTokenPayload } from 'src/shared/types/auth.types';
import { envConfig } from 'src/shared/configs';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConfig.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.usersService.getByUsername(payload.username);
    return { ...payload, ...user };
  }
}
