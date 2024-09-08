import { Module } from '@nestjs/common';

import { Session } from 'src/entities/session.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  // Add CRUD to manage Sessions
  imports: [SequelizeModule.forFeature([Session])],
})
export class SessionsModule {}
