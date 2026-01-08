import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

/**
 * Showtime detail response DTO for GET /:id API
 * Contains full nested objects for movie, room, theater
 */
class ShowtimeMovieResDto {
  @ApiProperty({
    type: String,
    description: 'Movie ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'Movie title',
    example: 'Inception',
  })
  @Expose()
  title!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Poster image URL',
    example: 'https://example.com/poster.jpg',
  })
  @Expose()
  posterUrl?: string;

  @ApiProperty({
    type: Number,
    description: 'Duration in minutes',
    example: 148,
  })
  @Expose()
  duration!: number;

  @ApiProperty({
    type: [String],
    description: 'Movie genres',
    example: ['Action', 'Sci-Fi'],
  })
  @Expose()
  genres!: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Age rating',
    example: 'P',
  })
  @Expose()
  ratingAge?: string;
}

class ShowtimeRoomResDto {
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

class ShowtimeTheaterResDto {
  @ApiProperty({
    type: String,
    description: 'Theater ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'Theater name',
    example: 'CGV Bitexco',
  })
  @Expose()
  theaterName!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Theater address',
    example: '2 Hai Trieu, District 1',
  })
  @Expose()
  address?: string;
}

export class ShowtimeDetailResDto {
  @ApiProperty({
    type: String,
    description: 'Showtime ID',
    example: '64a1f2e3b5c7d8a9e0f54321',
  })
  @Expose()
  _id!: string;

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

  @ApiPropertyOptional({
    type: String,
    description: 'Creation timestamp',
    example: '2025-11-01T12:00:00Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Last update timestamp',
    example: '2025-11-15T12:00:00Z',
  })
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional({
    type: ShowtimeMovieResDto,
    description: 'Full movie details',
  })
  @Expose()
  @Type(() => ShowtimeMovieResDto)
  movie?: ShowtimeMovieResDto;

  @ApiPropertyOptional({
    type: ShowtimeRoomResDto,
    description: 'Full room details',
  })
  @Expose()
  @Type(() => ShowtimeRoomResDto)
  room?: ShowtimeRoomResDto;

  @ApiPropertyOptional({
    type: ShowtimeTheaterResDto,
    description: 'Full theater details',
  })
  @Expose()
  @Type(() => ShowtimeTheaterResDto)
  theater?: ShowtimeTheaterResDto;
}
