import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Room } from "../schemas/room.schema";


@Injectable()
export class RoomRepository {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>
  ) {}

  findRoomById(id: string) {
    return this.roomModel
      .findById(id)
      .lean()
      .exec();
  }

  findRoomsByTheaterId(theaterId: string) {
    if (!theaterId)
      return []

    const filter = {
      theaterId: new Types.ObjectId(theaterId)
    };
    return this.roomModel
      .find(filter)
      .lean()
      .exec();
  }
}