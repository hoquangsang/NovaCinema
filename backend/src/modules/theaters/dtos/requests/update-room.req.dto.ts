import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import {
  ROOM_TYPE_VALUES,
  ROOM_TYPES,
  SEAT_MAP_EXAMPLE,
} from 'src/modules/theaters/constants';
import { RoomType, SeatType } from 'src/modules/theaters/types';

export class UpdateRoomReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Room name',
    example: 'Room 1',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({
    type: String,
    enum: ROOM_TYPE_VALUES,
    example: ROOM_TYPES._2D,
  })
  @IsOptional()
  @IsEnum(ROOM_TYPE_VALUES, { each: true })
  roomType?: RoomType;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '2D array of seats: NORMAL, VIP, COUPLE or null',
    example: SEAT_MAP_EXAMPLE,
  })
  @IsOptional()
  seatMap?: (SeatType | null)[][];
}
