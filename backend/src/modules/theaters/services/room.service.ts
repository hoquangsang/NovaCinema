import { Injectable, NotFoundException } from "@nestjs/common";
import { RoomRepository } from "../repositories/room.repository";

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepo: RoomRepository
    ) {}

    async getRoomById(id: string) {
        const room = await this.roomRepo.findRoomById(id);
        if (!room)
            throw new NotFoundException('Room not found');
        
        return room;
    }

    getRoomsByTheaterId(theaterId: string) {
        return this.roomRepo.findRoomsByTheaterId(theaterId);
    }
}