import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Session } from 'src/entities/session.entity';

@Table
export class Movie extends Model<Movie> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'Name of the Movie' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Age restriction for the movie if applied',
  })
  @Column({
    type: DataType.INTEGER,
  })
  ageRestriction: number;

  @HasMany(() => Session)
  sessions: Session[];
}
