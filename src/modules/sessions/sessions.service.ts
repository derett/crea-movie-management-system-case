import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable } from 'sequelize';
import { Movie } from 'src/entities/movie.entity';
import { Room } from 'src/entities/room.entity';
import { Session } from 'src/entities/session.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { forIn, pick } from 'lodash';

@Injectable()
export class SessionsService {
  private readonly updateAttributes: Partial<keyof Session>[] = [
    'date',
    'timeSlotId',
    'roomNumber',
    'movieId',
  ];

  private readonly defaultInclude: Includeable[] = [
    {
      model: Movie,
    },
    {
      model: TimeSlot,
    },
    {
      model: Room,
    },
  ];

  constructor(@InjectModel(Session) private model: typeof Session) {}

  findAll(): Promise<Session[]> {
    return this.model.findAll({ include: [...this.defaultInclude] });
  }

  findOne(id: string, includeOthers = false): Promise<Session> {
    return this.model.findByPk(id, {
      include: includeOthers ? [...this.defaultInclude] : [],
    });
  }

  create(createSessionDto: CreateSessionDto): Promise<Session> {
    return this.model.create(createSessionDto);
  }

  async update(updateSessionDto: UpdateSessionDto): Promise<Session> {
    const updates = pick(updateSessionDto, this.updateAttributes);

    const entity = await this.findOne(updateSessionDto.id);
    if (Object.values(updates).length) {
      forIn(updates, (value, key: keyof typeof updates) => {
        // TODO Fix this ts-ignore
        // @ts-ignore
        entity[key] = value;
      });
      await entity.save();
    }

    return entity;
  }

  async delete(id: string): Promise<void> {
    const session = await this.findOne(id);
    await session.destroy();
  }
}
