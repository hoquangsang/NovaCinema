/**
 * Showtimes Module
 * Module for movie showtimes management
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schema';
import { ShowtimeRepository } from './repositories/showtime.repository';
import { ShowtimeService } from './services/showtime.service';
import { ShowtimesController } from './controllers/showtimes.controller';
import { TheatersModule } from '../theaters/theaters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
    ]),
    TheatersModule,
  ],
  controllers: [ShowtimesController],
  providers: [
    ShowtimeRepository,
    ShowtimeService,
  ],
  exports: [ShowtimeRepository, ShowtimeService],
})
export class ShowtimesModule {}
