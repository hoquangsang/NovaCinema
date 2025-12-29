import { Seat, SeatMap, Theater } from 'src/modules/theaters';

export const THEATERS_DATA: Theater[] = [
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
  {
    theaterName: 'NovaCinema Crescent Mall',
    address: '101 Tôn Dật Tiên, Quận 7, TP.HCM',
    hotline: '1900 4444',
  },
  {
    theaterName: 'NovaCinema Giga Mall Thủ Đức',
    address: '240-242 Phạm Văn Đồng, Thủ Đức, TP.HCM',
    hotline: '1900 5555',
  },
  {
    theaterName: 'NovaCinema Sài Gòn Centre',
    address: '65 Lê Lợi, Quận 1, TP.HCM',
    hotline: '1900 6666',
  },
  {
    theaterName: 'NovaCinema Vivo City',
    address: '1058 Nguyễn Văn Linh, Quận 7, TP.HCM',
    hotline: '1900 7777',
  },
  {
    theaterName: 'NovaCinema Pearl Plaza',
    address: '561A Điện Biên Phủ, Bình Thạnh, TP.HCM',
    hotline: '1900 8888',
  },
  {
    theaterName: 'NovaCinema Royal City',
    address: '72 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    hotline: '1900 9999',
  },
  {
    theaterName: 'NovaCinema Times City',
    address: '458 Minh Khai, Hai Bà Trưng, Hà Nội',
    hotline: '1900 1010',
  },
  {
    theaterName: 'NovaCinema Vincom Bà Triệu',
    address: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
    hotline: '1900 1020',
  },
  {
    theaterName: 'NovaCinema Lotte Center',
    address: '54 Liễu Giai, Ba Đình, Hà Nội',
    hotline: '1900 1030',
  },
  {
    theaterName: 'NovaCinema Aeon Long Biên',
    address: '27 Cổ Linh, Long Biên, Hà Nội',
    hotline: '1900 1040',
  },
  {
    theaterName: 'NovaCinema Mipec Tower',
    address: '229 Tây Sơn, Đống Đa, Hà Nội',
    hotline: '1900 1050',
  },
  {
    theaterName: 'NovaCinema Vincom Đà Nẵng',
    address: '910 Ngô Quyền, Sơn Trà, Đà Nẵng',
    hotline: '1900 2010',
  },
  {
    theaterName: 'NovaCinema Indochina Riverside',
    address: '74 Bạch Đằng, Hải Châu, Đà Nẵng',
    hotline: '1900 2020',
  },
  {
    theaterName: 'NovaCinema Vincom Cần Thơ',
    address: '209 Đường 30/4, Ninh Kiều, Cần Thơ',
    hotline: '1900 3010',
  },
  {
    theaterName: 'NovaCinema Sense City Cần Thơ',
    address: '1 Đại lộ Hòa Bình, Ninh Kiều, Cần Thơ',
    hotline: '1900 3020',
  },
  {
    theaterName: 'NovaCinema Aeon Bình Dương',
    address: 'Số 1 Đại lộ Bình Dương, Thuận An, Bình Dương',
    hotline: '1900 4010',
  },
  {
    theaterName: 'NovaCinema Becamex Tower',
    address: '230 Đại lộ Bình Dương, Thủ Dầu Một, Bình Dương',
    hotline: '1900 4020',
  },
  {
    theaterName: 'NovaCinema Vincom Hải Phòng',
    address: '1 Lê Thánh Tông, Ngô Quyền, Hải Phòng',
    hotline: '1900 5010',
  },
  {
    theaterName: 'NovaCinema Aeon Hải Phòng',
    address: '10 Võ Nguyên Giáp, Lê Chân, Hải Phòng',
    hotline: '1900 5020',
  },
  {
    theaterName: 'NovaCinema Vinpearl Harbour',
    address: '78-80 Trần Phú, Lộc Thọ, Nha Trang',
    hotline: '1900 6010',
  },
  {
    theaterName: 'NovaCinema Đà Lạt Center',
    address: '15 Trần Phú, Phường 3, Đà Lạt',
    hotline: '1900 7010',
  },
  {
    theaterName: 'NovaCinema Lotte Mart Vũng Tàu',
    address: '3 Lê Lợi, Phường 1, Vũng Tàu',
    hotline: '1900 8010',
  },
  {
    theaterName: 'NovaCinema Vincom Huế',
    address: '50A Hùng Vương, Phú Nhuận, Huế',
    hotline: '1900 9010',
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
