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
import { User } from 'src/entities/users.entity';
import { Session } from './session.entity';

@Table
export class WatchHistory extends Model<WatchHistory> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Movie)
  @Column(DataType.UUID)
  movieId: string;

  @BelongsTo(() => Movie, {
    onDelete: 'CASCADE',
    foreignKey: 'movieId',
  })
  movie: Movie;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  customerId: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    foreignKey: 'customerId',
  })
  customer: User;

  @ForeignKey(() => Session)
  @Column(DataType.UUID)
  sessionId: string;

  @BelongsTo(() => Session, {
    onDelete: 'CASCADE',
    foreignKey: 'sessionId',
  })
  session: Session;
}
