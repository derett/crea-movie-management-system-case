import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TimeSlot } from 'src/entities/time-slots.entity';

@Module({
  imports: [SequelizeModule.forFeature([TimeSlot])],
})
export class TimeSlotsModule {}
