import { Injectable, NotFoundException } from "@nestjs/common";
import { SeatRepository } from "../repositories/seat.repository";

@Injectable()
export class SeatService {
    constructor(
        private readonly seatRepo: SeatRepository
    ) {}

    async getSeatById(id: string) {
        const seat = await this.seatRepo.findSeatById(id);
        if (!seat)
            throw new NotFoundException('Seat not found');
        return seat;
    }

    async getSeatsByRoomId(roomId: string) {
        const seats = await this.seatRepo.findSeatsByRoomId(roomId);
        if (!seats)
            throw new NotFoundException('Seats not found');
        
        return seats;
    }
}