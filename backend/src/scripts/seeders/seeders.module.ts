import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database';
import { UsersSeederModule } from './users';
import { MoviesSeederModule } from './movies';
import { TheaterSeederModule } from './theaters';
import { ShowtimeSeederModule } from './showtimes';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersSeederModule,
    MoviesSeederModule,
    TheaterSeederModule,
    ShowtimeSeederModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
