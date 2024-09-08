import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from 'src/entities/room.entity';

import roomsSeeds from '../../../.database/seeds/rooms.json';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room) private model: typeof Room) {
    this.model.bulkCreate(roomsSeeds, { ignoreDuplicates: true });
  }

  findAll(): Promise<Room[]> {
    return this.model.findAll();
  }
}
