import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from 'src/modules/movies';
import { TheatersModule } from 'src/modules/theaters';
import { Showtime, ShowtimeSchema } from './schemas';
import {
  ShowtimeCommandRepository,
  ShowtimeQueryRepository,
  ShowtimeRepository,
} from './repositories';
import { ShowtimeService } from './services';
import { ShowtimesController } from './controllers';

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
