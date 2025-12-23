import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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

  @ApiProperty({
    type: String,
    description: 'Movie ID associated with this showtime',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  movieId!: string;

  @ApiProperty({
    type: String,
    description: 'Room ID where the movie will be shown',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  roomId!: string;

  @ApiProperty({
    type: String,
    enum: ROOM_TYPE_VALUES,
    description: 'Type of room',
    example: ROOM_TYPES._2D,
  })
  @Expose()
  roomType!: RoomType;

  @ApiProperty({
    type: String,
    description: 'Theater ID where the movie will be shown',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  theaterId!: string;

  @ApiProperty({
    type: String,
    description: 'Start time of the showtime',
    example: '2025-12-25T18:30:00Z',
  })
  @Expose()
  startAt!: Date;

  @ApiProperty({
    type: String,
    description: 'End time of the showtime',
    example: '2025-12-25T20:45:00Z',
  })
  @Expose()
  endAt!: Date;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the showtime is currently active',
    example: true,
  })
  @Expose()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Creation timestamp of the showtime',
    example: '2025-11-01T12:00:00Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Last update timestamp of the showtime',
    example: '2025-11-15T12:00:00Z',
  })
  @Expose()
  updatedAt?: Date;
}
