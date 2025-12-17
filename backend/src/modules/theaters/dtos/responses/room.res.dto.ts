import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';
import { SeatResDto } from './seat.res.dto';

export class RoomResDto {
  @ApiProperty({
    type: String,
    description: 'Room ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'Theater ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  theaterId!: string;

  @ApiProperty({ type: String, description: 'Room name', example: 'Room A' })
  @Expose()
  roomName!: string;

  @ApiProperty({
    type: String,
    enum: ROOM_TYPES,
    description: 'Type of room',
    example: '2D',
  })
  @Expose()
  roomType!: RoomType;

  @ApiProperty({
    description: '2D array of seats: NORMAL, VIP, COUPLE or null',
    example: [
      ...Array.from({ length: 8 }, () =>
        Array.from({ length: 10 }, () => 'NORMAL'),
      ),
      [
        'COUPLE',
        'COUPLE',
        null,
        'VIP',
        null,
        null,
        'VIP',
        null,
        'COUPLE',
        'COUPLE',
      ],
    ],
  })
  @Expose()
  @Type(() => SeatResDto)
  seatMap!: (SeatResDto | null)[][];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Room is active',
    example: true,
  })
  @Expose()
  isActive?: boolean;

  // @ApiPropertyOptional({ type: Number, description: 'Capacity', example: 80 })
  // @Expose()
  // get capacity(): number {
  //   return this.seatMap?.flat(1).filter(seat => seat !== null).length ?? 0;
  // }
}
