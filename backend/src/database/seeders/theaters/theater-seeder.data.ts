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
  { roomName: 'Room 1', rowCount: 8, seatsPerRow: 10 },
  { roomName: 'Room 2', rowCount: 8, seatsPerRow: 10 },
  { roomName: 'Room 3', rowCount: 8, seatsPerRow: 10 },
];

export function generateSeats(
  theaterId: Types.ObjectId,
  roomId: Types.ObjectId,
  rowCount: number,
  seatsPerRow: number
): Partial<Seat>[] {
  const seats: Partial<Seat>[] = [];

  for (let row = 1; row <= rowCount; row++) {
    for (let number = 1; number <= seatsPerRow; number++) {
      seats.push({
        theaterId,
        roomId,
        row,
        number,
        seatCode: `${String.fromCharCode(64 + row)}${number}`, // A1, B1, ...
      });
    }
  }

  return seats;
}
