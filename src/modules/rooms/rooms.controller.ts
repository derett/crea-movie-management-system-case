import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Public()
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }
}
