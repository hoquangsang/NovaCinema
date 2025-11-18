import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from 'src/modules/movies/schemas/movie.schema';
import { MOVIES_MOCK } from './movie.seed.data';

@Injectable()
export class MovieSeedService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
  ) {}

  async seed() {
    await this.movieModel.deleteMany();

    await this.movieModel.insertMany(MOVIES_MOCK);
  }
}
