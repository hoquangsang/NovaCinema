import { Injectable, NotFoundException } from "@nestjs/common";
import { TheaterRepository } from "../repositories/theater.repository";
import { SeatRepository } from "../repositories/seat.repository";
import { RoomRepository } from "../repositories/room.repository";

@Injectable()
export class TheaterService {
  constructor(
    private readonly theaterRepo: TheaterRepository,
    private readonly roomRepo: RoomRepository,
    private readonly seatRepo: SeatRepository
  ) {}

  findTheaterById(id: string) {
    return this.theaterRepo.findById(id);
  }

  findAllTheaters() {
    return this.theaterRepo.findAll();
  }

  createTheater(
    data: {
      theaterName: string;
      address?: string;
      hotline?: string;
    }
  ) {
    return this.theaterRepo.create(data);
  }

  async updateById(
    id: string,
    updates: {
      theaterName?: string;
      address?: string;
      hotline?: string;
    }
  ) {
    const theater = await this.theaterRepo.findById(id);
    if (!theater) throw new NotFoundException('Theater not found');
    return this.theaterRepo.updateById(id, updates);
  }

  async deleteById(id: string) {
    const theater = await this.theaterRepo.findById(id);
    if (!theater) throw new NotFoundException('Theater not found');

    const rooms = await this.roomRepo.findRoomsByTheaterId(id);
    for (const room of rooms) {
      await this.seatRepo.deleteByRoomId(room._id);
    }
    await this.roomRepo.deleteByTheaterId(theater._id);

    return this.theaterRepo.deleteById(id);
  }
}