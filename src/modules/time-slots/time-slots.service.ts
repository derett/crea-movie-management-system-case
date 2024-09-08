import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimeSlot } from 'src/entities/time-slots.entity';

import timeSlotsSeeds from '../../../.database/seeds/time-slots.json';

@Injectable()
export class TimeSlotsService {
  constructor(@InjectModel(TimeSlot) private model: typeof TimeSlot) {
    this.model.bulkCreate(timeSlotsSeeds, { ignoreDuplicates: true });
  }

  findAll(): Promise<TimeSlot[]> {
    return this.model.findAll();
  }
}
