import { Controller, Get } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('time-slots')
@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Public()
  @Get()
  findAll() {
    return this.timeSlotsService.findAll();
  }
}
