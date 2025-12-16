import { Injectable } from "@nestjs/common";
import { MovieQueryRepository } from "./movie.query.repository";
import { MovieCommandRepository } from "./movie.command.repository";

@Injectable()
export class MovieRepository {
  public constructor(
    public readonly query: MovieQueryRepository,
    public readonly command: MovieCommandRepository,
  ) {
  }
}
