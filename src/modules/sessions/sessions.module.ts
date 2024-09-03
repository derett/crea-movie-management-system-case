import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { Session } from 'src/entities/session.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Session])],
  providers: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
