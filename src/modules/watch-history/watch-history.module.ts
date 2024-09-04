import { Module } from '@nestjs/common';
import { WatchHistoryController } from './watch-history.controller';
import { WatchHistoryService } from './watch-history.service';
import { WatchHistory } from 'src/entities/watch-history.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ticket } from 'src/entities/ticket.entity';

@Module({
  imports: [SequelizeModule.forFeature([WatchHistory, Ticket])],
  controllers: [WatchHistoryController],
  providers: [WatchHistoryService],
})
export class WatchHistoryModule {}
