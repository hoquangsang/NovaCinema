import { Injectable, NotFoundException } from "@nestjs/common";
import { RoomRepository } from "../repositories/room.repository";

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepo: RoomRepository
  ) {}
  
  findRoomById(id: string) {
    return this.roomRepo.findById(id);
  }

  getRoomsByTheaterId(theaterId: string) {
    return this.roomRepo.findRoomsByTheaterId(theaterId);
  }
}