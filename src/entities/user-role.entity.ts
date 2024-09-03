import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users.entity';
import { Role } from './roles.entity';

@Table({
  timestamps: false,
})
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    foreignKey: 'userId',
  })
  user: User;

  @PrimaryKey
  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  roleId: string;

  @BelongsTo(() => Role, {
    onDelete: 'CASCADE',
    foreignKey: 'roleId',
  })
  role: Role;
}
