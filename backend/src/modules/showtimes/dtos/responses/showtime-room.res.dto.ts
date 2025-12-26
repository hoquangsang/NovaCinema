import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class ShowtimeRoomResDto {
  @ApiProperty({
    type: String,
    description: 'Room ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'Room name',
    example: 'Room A',
  })
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

  @ApiPropertyOptional({
    type: Number,
    description: 'Room capacity (number of seats)',
    example: 120,
  })
  @Expose()
  capacity?: number;
}
