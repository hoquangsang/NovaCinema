import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPCOMING_MOVIES_DATA, SHOWING_MOVIES_DATA } from './movie-seeder.data';
import { Movie, MovieDocument } from 'src/modules/movies';

@Injectable()
export class MovieSeederService {
  private readonly logger = new Logger(MovieSeederService.name);

  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {}

  async seed() {
    this.logger.log('Clearing movies...');
    await this.movieModel.deleteMany();

    this.logger.log('Inserting movies...');
    await this.movieModel.insertMany(UPCOMING_MOVIES_DATA);
    await this.movieModel.insertMany(SHOWING_MOVIES_DATA);

    this.logger.log(`Movies inserted!`);
  }
}
