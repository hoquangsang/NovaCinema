import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schema';
import { ShowtimesController } from './controllers/showtimes.controller';
import { ShowtimeService } from './services/showtime.service';
import { ShowtimeRepository } from './repositories/showtime.repository';
import { MoviesModule } from '../movies';
import { TheatersModule } from '../theaters';
import {
  ShowtimeCommandRepository,
  ShowtimeQueryRepository,
} from './repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
    ]),
    MoviesModule,
    TheatersModule,
  ],
  controllers: [ShowtimesController],
  providers: [
    ShowtimeCommandRepository,
    ShowtimeQueryRepository,
    ShowtimeRepository,
    ShowtimeService,
  ],
  exports: [ShowtimeService],
})
export class ShowtimesModule {}
