import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDec } from 'src/shared/decorators/user.decorator';
import { User } from 'src/entities/users.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHelloUser(@UserDec() user: User): Promise<string> {
    return this.appService.getHello(user.id);
  }
}
