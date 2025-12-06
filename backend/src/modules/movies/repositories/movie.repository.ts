import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie, MovieDocument } from "../schemas/movie.schema";
import { BaseRepository } from "src/modules/shared";
import { WithId } from "src/modules/shared/repositories/base.repository";

@Injectable()
export class MovieRepository extends BaseRepository<Movie, MovieDocument> {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {
    super(movieModel);
  }

  findById(id: string) {
    return super.findById(id);
  }

  findShowingMovies(page: number, limit: number) {
    const today = new Date();
    const filter = {
      releaseDate: { $lte: today },
      endDate: { $gte: today },
    };

    return this.findPaginated({
      filter,
      page,
      limit,
      sort: { releaseDate: 1 }
    });
  }

  findUpcomingMovies(page: number, limit: number) {
    const today = new Date();
    const filter = {
      releaseDate: { $gt: today }
    };

    return this.findPaginated({
      filter,
      page,
      limit,
      sort: { releaseDate: 1 }
    });
  }

  create(data: Partial<Movie>) {
    return super.create(data);  
  }

  updateById(id: string, updates: Partial<Movie>) {
    return super.updateById(id, updates);
  }

  deleteById(id: string) {
    return super.deleteById(id);
  }
}
