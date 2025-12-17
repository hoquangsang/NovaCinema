import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieResDto {
  @ApiProperty({
    type: String,
    description: 'Movie ID',
    example: '64a1f2e3b5c7d8a9e0f12345',
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

  @ApiProperty({
    type: [String],
    description: 'Movie genres',
    example: ['Action', 'Sci-Fi'],
  })
  @Expose()
  genres!: string[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Duration in minutes',
    example: 148,
  })
  @Expose()
  duration?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Movie description',
    example: 'A mind-bending thriller.',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Poster image URL',
    example: 'https://example.com/poster.jpg',
  })
  @Expose()
  posterUrl?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Trailer video URL',
    example: 'https://example.com/trailer.mp4',
  })
  @Expose()
  trailerUrl?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Release date',
    example: '2010-07-16T00:00:00Z',
  })
  @Expose()
  releaseDate!: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'End date for showing',
    example: '2010-10-16T00:00:00Z',
  })
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Minimum recommended age',
    example: 'P',
  })
  @Expose()
  ratingAge?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Country of origin',
    example: 'USA',
  })
  @Expose()
  country?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Language of the movie',
    example: 'English',
  })
  @Expose()
  language?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Actors list',
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
  })
  @Expose()
  actors?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Director name',
    example: 'Christopher Nolan',
  })
  @Expose()
  director?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Producer name',
    example: 'Emma Thomas',
  })
  @Expose()
  producer?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Creation timestamp',
    example: '2023-07-01T12:00:00Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Last update timestamp',
    example: '2023-07-15T12:00:00Z',
  })
  @Expose()
  updatedAt?: Date;
}
