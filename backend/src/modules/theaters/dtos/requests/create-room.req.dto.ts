import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
} from 'class-validator';
import {
  ROOM_TYPE_VALUES,
  ROOM_TYPES,
  SEAT_MAP_EXAMPLE,
} from '../../constants';
import { RoomType, SeatType } from '../../types';

export class CreateRoomReqDto {
  @ApiProperty({ type: String, description: 'Room name', example: 'Room 1' })
  @IsNotEmpty()
  @IsString()
  roomName!: string;

  @ApiPropertyOptional({
    type: String,
    enum: ROOM_TYPE_VALUES,
    description: 'Room type',
    example: ROOM_TYPES._2D,
  })
  @IsOptional()
  @IsEnum(ROOM_TYPE_VALUES)
  roomType?: RoomType;

  @ApiPropertyOptional({
    description: '2D array of seats: NORMAL, VIP, COUPLE or null',
    example: SEAT_MAP_EXAMPLE,
  })
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(40)
  seatMap!: (SeatType | null)[][];
}
