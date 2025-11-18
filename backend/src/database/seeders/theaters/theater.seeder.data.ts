import { Types } from "mongoose";
import { Seat } from "src/modules/theaters/schemas/seat.schema";

export const THEATERS_MOCK = [
  {
    theaterName: 'NovaCinema Landmark 81',
    address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM',
    hotline: '1900 1111',
  },
  {
    theaterName: 'NovaCinema Aeon Bình Tân',
    address: '30B Avenue, Bình Tân, TP.HCM',
    hotline: '1900 2222',
  },
  {
    theaterName: 'NovaCinema Vincom Đồng Khởi',
    address: '72 Đồng Khởi, Quận 1, TP.HCM',
    hotline: '1900 3333',
  }
];

export const ROOMS_MOCK = [
  { roomName: 'Room 1', capacity: 80 },
  { roomName: 'Room 2', capacity: 80 },
  { roomName: 'Room 3', capacity: 80 },
];

export function generateSeats(roomId: Types.ObjectId): Partial<Seat>[] {
  const seats: Partial<Seat>[] = [];
  const rows = 'ABCDEFGH';

  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        roomId,
        seatNumber: `${row}${i}`,
      });
    }
  }

  return seats;
}
