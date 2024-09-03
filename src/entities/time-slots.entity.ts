import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: false,
})
export class TimeSlot extends Model<TimeSlot> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  // TODO Move to a better data structure
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  timeSlot: string;
}
