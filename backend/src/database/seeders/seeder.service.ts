import { Injectable, Logger } from '@nestjs/common';
import { MovieSeederService } from './movies/movie.seeder.service';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        private readonly movieSeeder: MovieSeederService,
    ) {}

    async seedAll() {
        this.logger.log('Seeding movies...');
        await this.movieSeeder.seed();

        this.logger.log('All seed done');
    }
}