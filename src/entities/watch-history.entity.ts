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

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;
}
