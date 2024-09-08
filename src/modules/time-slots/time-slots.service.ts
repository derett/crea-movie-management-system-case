import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimeSlot } from 'src/entities/time-slots.entity';

@Injectable()
export class TimeSlotsService {
  constructor(@InjectModel(TimeSlot) private model: typeof TimeSlot) {}

  findAll(): Promise<TimeSlot[]> {
    return this.model.findAll();
  }
}
