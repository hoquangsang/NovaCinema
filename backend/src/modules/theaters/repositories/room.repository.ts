import { Injectable } from "@nestjs/common";
import { RoomCommandRepository } from "./room.command.repository";
import { RoomQueryRepository } from "./room.query.repository";

@Injectable()
export class RoomRepository {
  public constructor(
    public readonly query: RoomQueryRepository,
    public readonly command: RoomCommandRepository,
  ) {
  }
}