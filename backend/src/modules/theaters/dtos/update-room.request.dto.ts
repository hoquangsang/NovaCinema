import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsIn, IsArray, ArrayMinSize, ArrayMaxSize } from "class-validator";
import { ROOM_TYPES, RoomType, SeatType } from "../constants";

const SEAT_MAP_EXAMPLE = [
  ...Array.from({ length: 8 }, () => Array.from({ length: 10 }, () => 'NORMAL')),
  ['COUPLE','COUPLE',null,'VIP',null,null,'VIP',null,'COUPLE','COUPLE']
];

export class UpdateRoomRequestDto {
  @ApiPropertyOptional({ type: String, description: 'Room name', example: 'Room 1' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({ type: String, enum: ROOM_TYPES })
  @IsOptional()
  @IsIn(ROOM_TYPES, { each: true })
  roomType?: RoomType;

  @ApiPropertyOptional({ type: Boolean, description: 'Active status', example: true })
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
