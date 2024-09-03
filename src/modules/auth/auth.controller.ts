import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterDataDto } from './dto/register-data.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: FastifyRequest) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() registerBody: RegisterDataDto) {
    return await this.authService.register(registerBody);
  }
}
