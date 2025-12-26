import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ShowtimeMovieResDto {
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
