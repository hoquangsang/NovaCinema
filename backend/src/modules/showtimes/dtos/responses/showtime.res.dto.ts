import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class ShowtimeResDto {
  @ApiProperty({
    type: String,
    description: 'Showtime ID',
    example: '64a1f2e3b5c7d8a9e0f54321',
  })
  @Expose()
  _id!: string;

  // movie
  @ApiProperty({
    type: String,
    description: 'Movie ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  movieId!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Movie title',
    example: 'Inception',
  })
  @Expose()
  movieTitle?: string;

  // theater
  @ApiProperty({
    type: String,
    description: 'Theater ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  theaterId!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Theater name',
    example: 'CGV Bitexco',
  })
  @Expose()
  theaterName?: string;

  // room
  @ApiProperty({
    type: String,
    description: 'Room ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  roomId!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Room name',
    example: 'Room 1',
  })
  @Expose()
  roomName?: string;

  @ApiProperty({
    type: String,
    enum: ROOM_TYPE_VALUES,
    description: 'Type of room',
    example: ROOM_TYPES._2D,
  })
  @Expose()
  roomType!: RoomType;

  //
  @ApiProperty({
    type: String,
    description: 'Start time',
    example: '2025-12-25T18:30:00Z',
  })
  @Expose()
  startAt!: Date;

  @ApiProperty({
    type: String,
    description: 'End time',
    example: '2025-12-25T20:45:00Z',
  })
  @Expose()
  endAt!: Date;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Active status',
    example: true,
  })
  @Expose()
  isActive?: boolean;
}
