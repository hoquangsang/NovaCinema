import { Injectable, NotFoundException } from "@nestjs/common";
import { RoomRepository } from "../repositories/room.repository";
import { SeatRepository } from "../repositories/seat.repository";
import { Seat } from "../schemas/seat.schema";
import { Types } from "mongoose";

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepo: RoomRepository,
    private readonly seatRepo: SeatRepository
  ) {}
  
  findRoomById(id: string) {
    return this.roomRepo.findById(id);
  }

  getRoomsByTheaterId(theaterId: string) {
    return this.roomRepo.findRoomsByTheaterId(theaterId);
  }

  async addRoomToTheater(
    data: {
      theaterId: string;
      roomName: string;
      rowCount: number;
      seatsPerRow: number;
    }
  ) {
    const room = await this.roomRepo.create({
      theaterId: new Types.ObjectId(data.theaterId),
      roomName: data.roomName,
      rowCount: data.rowCount,
      seatsPerRow: data.seatsPerRow,
      capacity: data.rowCount * data.seatsPerRow
    });

    const seats: Partial<Seat>[] = [];
    for (let row = 1; row <= data.rowCount; row++) {
      for (let num = 1; num <= data.seatsPerRow; num++) {
        seats.push({
          theaterId: new Types.ObjectId(data.theaterId),
          roomId: new Types.ObjectId(room._id),
          row,
          number: num,
          seatCode: `${String.fromCharCode(64 + row)}${num}`,
        });
      }
    }
    await this.seatRepo.createMany(seats);
    return room;
  }

  async updateById(
    id: string,
    updates: {
      rowCount?: number;
      seatsPerRow?: number
    }
  ) {
    const room = await this.roomRepo.findById(id);
    if (!room) throw new NotFoundException('Room not found');

    const newRowCount = updates.rowCount ?? room.rowCount;
    const newSeatsPerRow = updates.seatsPerRow ?? room.seatsPerRow;
    const newCapacity = newRowCount * newSeatsPerRow;

    if (newRowCount !== room.rowCount || newSeatsPerRow !== room.seatsPerRow) {
      await this.seatRepo.deleteByRoomId(room._id);
      const seats: Partial<Seat>[] = [];
      for (let row = 1; row <= newRowCount; row++) {
        for (let num = 1; num <= newSeatsPerRow; num++) {
          seats.push({
            roomId: new Types.ObjectId(room._id),
            row,
            number: num,
            seatCode: `${String.fromCharCode(64 + row)}${num}`,
          });
        }
      }
      await this.seatRepo.createMany(seats);
    }

    return this.roomRepo.updateById(id, {
      rowCount: newRowCount,
      seatsPerRow: newSeatsPerRow,
      capacity: newCapacity
    });
  }

  async deleteById(id: string) {
    const room = await this.roomRepo.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    
    await this.seatRepo.deleteByRoomId(room._id);
    return this.roomRepo.deleteById(id);
  }
}