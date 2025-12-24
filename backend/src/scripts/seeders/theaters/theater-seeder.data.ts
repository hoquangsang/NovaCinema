import { Seat, SeatMap } from 'src/modules/theaters';

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
  },
];

export function generateSeatMap(
  rowCount: number,
  seatsPerRow: number,
): SeatMap {
  const seatMap: SeatMap = [];

  for (let row = 0; row < rowCount; row++) {
    const seatRow: (Seat | null)[] = [];
    for (let col = 0; col < seatsPerRow; col++) {
      seatRow.push({
        seatCode: `${String.fromCharCode(65 + row)}${col + 1}`, // A1, B1, ...
        seatType: 'NORMAL',
        isActive: true,
      });
    }
    seatMap.push(seatRow);
  }

  return seatMap;
}
