import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [SequelizeModule.forFeature([Room])],
})
export class RoomsModule {}
