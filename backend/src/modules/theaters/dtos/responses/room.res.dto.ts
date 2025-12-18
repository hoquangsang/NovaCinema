import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ROOM_TYPE_VALUES,
  ROOM_TYPES,
  SEAT_MAP_EXAMPLE,
} from 'src/modules/theaters/constants';
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
    enum: ROOM_TYPE_VALUES,
    description: 'Type of room',
    example: ROOM_TYPES._2D,
  })
  @Expose()
  roomType!: RoomType;

  @ApiProperty({
    description: '2D array of seats: NORMAL, VIP, COUPLE or null',
    example: SEAT_MAP_EXAMPLE,
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

  @ApiPropertyOptional({ type: Number, description: 'Capacity', example: 84 })
  @Expose()
  capacity?: number;
}
