import { Injectable } from "@nestjs/common";
import { SeatRepository } from "../repositories/seat.repository";

@Injectable()
export class SeatService {
  constructor(
    private readonly seatRepo: SeatRepository
  ) {}

  findSeatById(id: string) {
    return this.seatRepo.findById(id);
  }

  findSeatsByRoomId(roomId: string) {
    return this.seatRepo.findSeatsByRoomId(roomId);
  }
}