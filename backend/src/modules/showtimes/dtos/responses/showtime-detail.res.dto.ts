import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ShowtimeMovieResDto } from './showtime-movie.res.dto';
import { ShowtimeRoomResDto } from './showtime-room.res.dto';
import { ShowtimeTheaterResDto } from './showtime-theater.res.dto';

/**
 * Showtime detail response DTO for GET /:id API
 * Contains full nested objects for movie, room, theater
 */
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
