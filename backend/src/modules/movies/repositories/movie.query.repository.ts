import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QueryRepository } from "src/modules/base/repositories/query";
import { Movie, MovieDocument } from "../schemas/movie.schema";

@Injectable()
export class MovieQueryRepository extends QueryRepository<Movie, MovieDocument> {
  public constructor(
    @InjectModel(Movie.name)
    protected readonly theaterModel: Model<MovieDocument>
  ) {
    super(theaterModel);
  }
}
