import { Types } from 'mongoose';
import { Theater } from 'src/modules/theaters';
import { SEAT_TYPES } from 'src/modules/theaters/constants';
import { RoomType, SeatType } from 'src/modules/theaters/types';

export const THEATERS_DATA: Theater[] = [
  {
    theaterName: 'NovaCinema Landmark 81',
    address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh, Ho Chi Minh',
    hotline: '1900 1111',
  },
  {
    theaterName: 'NovaCinema Vincom Đồng Khởi',
    address: '72 Đồng Khởi, Quận 1, Ho Chi Minh',
    hotline: '1900 1112',
  },
  {
    theaterName: 'NovaCinema Aeon Bình Tân',
    address: '30B Avenue, Bình Tân, Ho Chi Minh',
    hotline: '1900 1113',
  },
  {
    theaterName: 'NovaCinema Giga Mall Thủ Đức',
    address: '240-242 Phạm Văn Đồng, Thủ Đức, Ho Chi Minh',
    hotline: '1900 1114',
  },
  {
    theaterName: 'NovaCinema Royal City',
    address: '72 Nguyễn Trãi, Thanh Xuân, Ha Noi',
    hotline: '1900 2221',
  },
  {
    theaterName: 'NovaCinema Times City',
    address: '458 Minh Khai, Hai Bà Trưng, Ha Noi',
    hotline: '1900 2222',
  },
  {
    theaterName: 'NovaCinema Vincom Bà Triệu',
    address: '191 Bà Triệu, Hai Bà Trưng, Ha Noi',
    hotline: '1900 2223',
  },
  {
    theaterName: 'NovaCinema Lotte Center',
    address: '54 Liễu Giai, Ba Đình, Ha Noi',
    hotline: '1900 2224',
  },
  {
    theaterName: 'NovaCinema Vincom Đà Nẵng',
    address: '910 Ngô Quyền, Sơn Trà, Da Nang',
    hotline: '1900 3331',
  },
  {
    theaterName: 'NovaCinema Indochina Riverside',
    address: '74 Bạch Đằng, Hải Châu, Da Nang',
    hotline: '1900 3332',
  },
  {
    theaterName: 'NovaCinema Vincom Cần Thơ',
    address: '209 Đường 30/4, Ninh Kiều, Can Tho',
    hotline: '1900 4441',
  },
  {
    theaterName: 'NovaCinema Sense City Cần Thơ',
    address: '1 Đại lộ Hòa Bình, Ninh Kiều, Can Tho',
    hotline: '1900 4442',
  },
];

const LAST_ROW: (SeatType | null)[] = [
  SEAT_TYPES.COUPLE,
  SEAT_TYPES.COUPLE,
  null,
  SEAT_TYPES.VIP,
  null,
  null,
  SEAT_TYPES.VIP,
  null,
  SEAT_TYPES.COUPLE,
  SEAT_TYPES.COUPLE,
];

const LAYOUT: (SeatType | null)[][] = [
  ...Array.from({ length: 8 }, () =>
    Array.from({ length: 10 }, () => SEAT_TYPES.NORMAL),
  ),
  LAST_ROW,
];

const CAPACITY = LAYOUT.flat().filter((seat) => seat !== null).length;

function seatCode(rowIndex: number, seatIndex: number): string {
  return `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
}

function buildSeatMap() {
  return LAYOUT.map((row, rowIndex) => {
    const seatRow: ({ seatCode: string; seatType: SeatType; isActive: boolean } | null)[] = [];
    let seatNumber = 1;

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const seatType = row[colIndex];

      if (!seatType) {
        seatRow.push(null);
        continue;
      }

      // COUPLE SEAT HANDLING
      if (seatType === SEAT_TYPES.COUPLE) {
        if (row[colIndex + 1] !== SEAT_TYPES.COUPLE) {
          throw new Error(
            `COUPLE seat at row ${rowIndex}, col ${colIndex} must be paired`,
          );
        }

        const code = seatCode(rowIndex, seatNumber);
        seatRow.push({ seatCode: code, seatType, isActive: true });
        seatRow.push({ seatCode: code, seatType, isActive: true });

        seatNumber += 2;
        colIndex++;
        continue;
      }

      seatRow.push({
        seatCode: seatCode(rowIndex, seatNumber),
        seatType,
        isActive: true,
      });
      seatNumber++;
    }

    return seatRow;
  });
}

export function generateRoom(
  theaterId: Types.ObjectId,
  roomName: string,
  roomType: RoomType,
) {
  return {
    theaterId,
    roomName,
    roomType,
    seatMap: buildSeatMap(),
    capacity: CAPACITY,
    isActive: true,
  };
}
