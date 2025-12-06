import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "src/modules/shared";
import { Room, RoomDocument } from "../schemas/room.schema";

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

  updateById(id: string, updates: Partial<Room>) {
    return super.updateById(id, updates);
  }

  deleteById(id: string) {
    return super.deleteById(id);
  }

  deleteByTheaterId(theaterId: string) {
    const objectId = new Types.ObjectId(theaterId);
    return this.deleteMany({ theaterId: objectId });
  }
}