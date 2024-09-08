import { Module } from '@nestjs/common';

import { Session } from 'src/entities/session.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  // Add CRUD to manage Sessions
  imports: [SequelizeModule.forFeature([Session])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
