import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';
import { ToDateOnlyStart } from 'src/common/decorators';

export class UpdateMovieReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Movie title',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Movie genres',
    example: ['Action', 'Sci-Fi'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Duration in minutes',
    example: 148,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Movie description',
    example: 'A mind-bending thriller.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Poster image URL',
    example: 'https://example.com/poster.jpg',
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Trailer video URL',
    example: 'https://example.com/trailer.mp4',
  })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Release date',
    example: '2025-12-12',
  })
  @IsOptional()
  @IsDate({ message: 'releaseDate must be yyyy-MM-dd' })
  @ToDateOnlyStart()
  releaseDate?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'End date for showing',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsOptional()
  @IsDate({ message: 'endDate must be yyyy-MM-dd' })
  endDate?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Minimum recommended age',
    example: 'P',
  })
  @IsOptional()
  @IsNumber()
  ratingAge?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Country of origin',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Language of the movie',
    example: 'English',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Actors list',
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actors?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Director name',
    example: 'Christopher Nolan',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Producer name',
    example: 'Emma Thomas',
  })
  @IsOptional()
  @IsString()
  producer?: string;
}
