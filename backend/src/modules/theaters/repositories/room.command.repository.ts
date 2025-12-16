import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommandRepository } from "src/modules/base/repositories/command";
import { Room, RoomDocument } from "../schemas/room.schema";

@Injectable()
export class RoomCommandRepository extends CommandRepository<Room, RoomDocument> {
  public constructor(
    @InjectModel(Room.name)
    protected readonly roomModel: Model<RoomDocument>
  ) {
    super(roomModel);
  }
}
