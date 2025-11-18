import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Movie, MovieDocument } from "../schemas/movie.schema";


@Injectable()
export class MovieRepository {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
  ) {}

  findMovieById(id: string): Promise<Movie | null> {
    return this.movieModel
      .findById(id)
      .lean()
      .exec();
  }

  async findShowingMovies(
    page: number,
    limit: number
  )
  {
    const today = new Date();
    const skip = (page - 1) * limit;
    const filter = {
      releaseDate: { $lte: today },
      endDate: { $gte: today },
    }
    
    const [data, total] = await Promise.all([
      this.movieModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      
      this.movieModel
        .countDocuments(filter)
        .exec(),
    ]);

    return { data, total };
  }

  async findUpcomingMovies(
    page: number,
    limit: number
  ) {
    const today = new Date();
    const skip = (page - 1) * limit;
    const filter = {
      releaseDate: { $gt: today }
    }
    
    const [data, total] = await Promise.all([
      this.movieModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      this.movieModel
        .countDocuments(filter)
        .exec(),
    ]);
    return { data, total };
  }
}