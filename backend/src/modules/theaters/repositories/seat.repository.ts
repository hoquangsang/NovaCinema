import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Seat, SeatDocument } from "../schemas/seat.schema";


@Injectable()
export class SeatRepository {
  constructor(
    @InjectModel(Seat.name)
    private readonly seatModel: Model<SeatDocument>
  ) {}

  findSeatById(id: string) {
    return this.seatModel
      .findById(id)
      .lean()
      .exec();
  }

  findSeatsByRoomId(roomId: string) {
    if (!roomId)
      return []

    const filter = {
      roomId: new Types.ObjectId(roomId)
    };
    return this.seatModel
      .find(filter)
      .lean()
      .exec();
  }
}