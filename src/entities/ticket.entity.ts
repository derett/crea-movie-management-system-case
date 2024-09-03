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
import { Session } from 'src/entities/session.entity';
import { User } from 'src/entities/users.entity';

@Table
export class Ticket extends Model<Ticket> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Session)
  @Column(DataType.UUID)
  sessionId: string;

  @BelongsTo(() => Session, {
    onDelete: 'CASCADE',
    foreignKey: 'sessionId',
  })
  session: Session;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  customerId: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    foreignKey: 'customerId',
  })
  customer: User;
}
