import { Injectable, Logger } from '@nestjs/common';
import { UserSeederService } from './users/user-seeder.service';
import { MovieSeederService } from './movies/movie-seeder.service';
import { TheaterSeederService } from './theaters/theater-seeder.service';
import { ShowtimeSeederService } from './showtimes/showtime-seeder.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userSeeder: UserSeederService,
    private readonly movieSeeder: MovieSeederService,
    private readonly theaterSeeder: TheaterSeederService,
    private readonly showtimeSeeder: ShowtimeSeederService,
  ) {}

  async seed() {
    await this.userSeeder.seed();

    await this.movieSeeder.seed();

    await this.theaterSeeder.seed();

    await this.showtimeSeeder.seed();

    this.logger.log('All seed done');
  }
}
