import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Seat, SeatDocument } from "../schemas/seat.schema";
import { BaseRepository } from "src/modules/shared";


@Injectable()
export class SeatRepository extends BaseRepository<Seat, SeatDocument> {
  constructor(
    @InjectModel(Seat.name)
    private readonly seatModel: Model<SeatDocument>
  ) {
    super(seatModel);
  }

  findById(id: string) {
    return super.findById(id);
  }

  findSeatsByRoomId(roomId: string) {
    return this.findMany({
      roomId,
    });
  }

  create(data: Partial<Seat>) {
    return super.create(data);  
  }

  deleteById(id: string) {
    return super.deleteById(id);
  }
}