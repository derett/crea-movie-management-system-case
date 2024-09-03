import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Movie } from 'src/entities/movie.entity';
import { Room } from 'src/entities/room.entity';
import { TimeSlot } from 'src/entities/time-slots.entity';

@Table({
  timestamps: false,
})
export class Session extends Model<Session> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;

  @ForeignKey(() => TimeSlot)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  timeSlotId: string;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roomNumber: string;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  movieId: string;

  @BelongsTo(() => TimeSlot, {
    onDelete: 'CASCADE',
  })
  timeSlot: TimeSlot;

  @BelongsTo(() => Room, {
    onDelete: 'CASCADE',
  })
  room: Room;

  @BelongsTo(() => Room, {
    onDelete: 'CASCADE',
  })
  movie: Movie;
}
