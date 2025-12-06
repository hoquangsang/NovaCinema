import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "src/modules/shared";
import { Room, RoomDocument } from "../schemas/room.schema";
import { WithId } from "src/modules/shared/repositories/base.repository";

@Injectable()
export class RoomRepository extends BaseRepository<Room, RoomDocument> {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>
  ) {
    super(roomModel);
  }
  
  findById(id: string) {
    return super.findById(id);
  }

  findRoomsByTheaterId(theaterId: string) {
    return this.findMany({
      theaterId,
    });
  }

  create(data: Partial<Room>) {
    return super.create(data);
  }

  deleteById(id: string) {
    return super.deleteById(id);
  }
}