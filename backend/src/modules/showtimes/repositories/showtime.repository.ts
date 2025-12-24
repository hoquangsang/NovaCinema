import { Injectable } from "@nestjs/common";
import { ShowtimeQueryRepository } from "./showtime.query.repository";
import { ShowtimeCommandRepository } from "./showtime.command.repository";

@Injectable()
export class ShowtimeRepository {
  public constructor(
    public readonly query: ShowtimeQueryRepository,
    public readonly command: ShowtimeCommandRepository,
  ) {
  }
}
