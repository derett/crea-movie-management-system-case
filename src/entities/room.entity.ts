import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: false,
})
export class Room extends Model<Room> {
  @PrimaryKey
  @Column(DataType.STRING)
  roomNumber: string;
}
