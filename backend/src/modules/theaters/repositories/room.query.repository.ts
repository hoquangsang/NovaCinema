import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { QueryRepository } from "src/modules/base/repositories/query";
import { Room, RoomDocument } from "../schemas/room.schema";

@Injectable()
export class RoomQueryRepository extends QueryRepository<Room, RoomDocument> {
  public constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>
  ) {
    super(roomModel);
  }
}
