import { Module } from '@nestjs/common';
import { MoviesModule } from 'src/modules/movies/movies.module';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { SessionsModule } from 'src/modules/sessions/sessions.module';
import { TicketsModule } from 'src/modules/tickets/tickets.module';
import { TimeSlotsModule } from 'src/modules/time-slots/time-slots.module';
import { WatchHistoryModule } from 'src/modules/watch-history/watch-history.module';

@Module({
  imports: [
    MoviesModule,
    RoomsModule,
    SessionsModule,
    TimeSlotsModule,
    TicketsModule,
    WatchHistoryModule,
  ],
})
export class DataModule {}
