import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommandRepository } from "src/modules/base/repositories";
import { Movie, MovieDocument } from "../schemas/movie.schema";


@Injectable()
export class MovieCommandRepository extends CommandRepository<Movie, MovieDocument> {
  public constructor(
    @InjectModel(Movie.name)
    protected readonly theaterModel: Model<MovieDocument>
  ) {
    super(theaterModel);
  }
}
