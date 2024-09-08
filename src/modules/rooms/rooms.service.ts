import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room) private model: typeof Room) {}

  findAll(): Promise<Room[]> {
    return this.model.findAll();
  }
}
