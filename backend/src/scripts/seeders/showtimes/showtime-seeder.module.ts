import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { Showtime, ShowtimeSchema } from 'src/modules/showtimes';
import { Movie, MovieSchema } from 'src/modules/movies';
import { Theater, TheaterSchema, Room, RoomSchema } from 'src/modules/theaters';
import { ShowtimeSeederService } from './showtime-seeder.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Theater.name, schema: TheaterSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  providers: [ShowtimeSeederService],
  exports: [ShowtimeSeederService],
})
export class ShowtimeSeederModule {}
