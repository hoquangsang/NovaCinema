import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ROOM_TYPES, RoomType, SEAT_TYPES, SeatType } from '../constants';

const SEAT_MAP_EXAMPLE = [
  ...Array.from({ length: 8 }, () => Array.from({ length: 10 }, () => 'NORMAL')),
  ['COUPLE','COUPLE',null,'VIP',null,null,'VIP',null,'COUPLE','COUPLE']
];

export class CreateRoomRequestDto {
  @ApiProperty({ type: String, description: 'Room name', example: 'Room 1' })
  @IsNotEmpty()
  @IsString()
  roomName!: string;

  @ApiPropertyOptional({ type: String, enum: ROOM_TYPES, description: 'Room type', example: '2D' })
  @IsOptional()
  @IsIn(ROOM_TYPES)
  roomType?: RoomType;

  @ApiPropertyOptional({
    description: '2D array of seats: NORMAL, VIP, COUPLE or null',
    example: SEAT_MAP_EXAMPLE,
  })
  @IsArray()
  @IsArray({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(10)
  @ArrayMaxSize(30)
  seatMap!: (SeatType | null)[][];
}
