import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDataDto } from './dto/register-data.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }

  @Post('register')
  async register(@Body() registerBody: RegisterDataDto) {
    return await this.authService.register(registerBody);
  }
}
