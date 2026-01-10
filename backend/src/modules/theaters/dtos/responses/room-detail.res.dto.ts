import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SEAT_MAP_EXAMPLE } from 'src/modules/theaters/constants';
import { SeatResDto } from './seat.res.dto';
import { RoomResDto } from './room.res.dto';

export class RoomDetailResDto extends RoomResDto {
  @ApiProperty({
    description: '2D array of seats: NORMAL, VIP, COUPLE or null',
    example: SEAT_MAP_EXAMPLE,
  })
  @Expose()
  @Type(() => SeatResDto)
  seatMap!: (SeatResDto | null)[][];
}
