import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { Movie, MovieDocument } from '../schemas';

@Injectable()
export class MovieCommandRepository extends CommandRepository<
  Movie,
  MovieDocument
> {
  public constructor(
    @InjectModel(Movie.name)
    protected readonly theaterModel: Model<MovieDocument>,
  ) {
    super(theaterModel);
  }
}
