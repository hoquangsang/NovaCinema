import { Injectable, Logger } from '@nestjs/common';
import { MovieSeederService } from './movies/movie-seeder.service';
import { TheaterSeederService } from './theaters/theater-seeder.service';
import { UserSeederService } from './users/user-seeder.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userSeeder: UserSeederService,
    private readonly movieSeeder: MovieSeederService,
    private readonly theaterSeeder: TheaterSeederService,
  ) {}

  async seed() {
    await this.userSeeder.seed();

    await this.movieSeeder.seed();

    await this.theaterSeeder.seed();

    this.logger.log('All seed done');
  }
}
