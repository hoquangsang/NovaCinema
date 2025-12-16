import { Injectable } from "@nestjs/common";
import { TheaterCommandRepository } from "./theater.command.repository";
import { TheaterQueryRepository } from "./theater.query.repository";

@Injectable()
export class TheaterRepository {
  public constructor(
    public readonly query: TheaterQueryRepository,
    public readonly command: TheaterCommandRepository,
  ) {
  }
}
