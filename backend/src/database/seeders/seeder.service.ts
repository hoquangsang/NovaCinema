import { Injectable, Logger } from '@nestjs/common';
import { MovieSeederService } from './movies/movie-seeder.service';
import { TheaterSeederService } from './theaters/theater-seeder.service';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        private readonly movieSeeder: MovieSeederService,
        private readonly theaterSeeder: TheaterSeederService
    ) {}

    async seedAll() {
        this.logger.log('Seeding movies...');
        await this.movieSeeder.seed();

        this.logger.log('Seeding theaters...')
        await this.theaterSeeder.seed();

        this.logger.log('All seed done');
    }
}