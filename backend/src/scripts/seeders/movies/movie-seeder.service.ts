import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from 'src/modules/movies';
import { MOVIES_DATA } from './movie-seeder.data';

@Injectable()
export class MovieSeederService {
  private readonly logger = new Logger(MovieSeederService.name);

  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {}

  async seed() {
    this.logger.log('Clearing movies...');
    const deleted = await this.movieModel.deleteMany();
    this.logger.log(`Deleted ${deleted.deletedCount || 0} existing movies.`);

    this.logger.log('Preparing movie data...');
    MOVIES_DATA.forEach((m, idx) => {
      const days =
        m.endDate && m.releaseDate
          ? Math.ceil(
              (m.endDate.getTime() - m.releaseDate.getTime()) /
                (24 * 60 * 60 * 1000),
            )
          : 0;

      const shortTitle =
        m.title.length > 30 ? m.title.slice(0, 27) + '...' : m.title;

      this.logger.log(
        `[${String(idx + 1).padStart(2, '0')}] | ${shortTitle.padEnd(30)} | release: ${m.releaseDate.toISOString().slice(0, 10)} | duration: ${days} day(s)`,
      );
    });

    this.logger.log('Inserting movies...');
    const inserted = await this.movieModel.insertMany(MOVIES_DATA);
    this.logger.log(`Inserted ${inserted.length} movies successfully!`);
  }
}
