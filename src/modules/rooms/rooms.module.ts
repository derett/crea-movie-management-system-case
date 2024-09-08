import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from 'src/entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [SequelizeModule.forFeature([Room])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
