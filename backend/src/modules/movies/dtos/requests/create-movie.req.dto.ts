import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToDateTime } from 'src/common/decorators';

export class CreateMovieReqDto {
  @ApiProperty({
    type: String,
    description: 'Movie title',
    example: 'Inception',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: [String],
    description: 'Movie genres',
    example: ['Action', 'Sci-Fi'],
  })
  @IsArray()
  genres!: string[];

  @ApiPropertyOptional({
    type: Number,
    description: 'Duration in minutes',
    example: 148,
  })
  @IsOptional()
  @IsNumber()
  duration!: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Short description',
    example: 'A mind-bending thriller',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Poster URL',
    example: 'https://example.com/poster.jpg',
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Trailer URL',
    example: 'https://example.com/trailer.mp4',
  })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiProperty({
    type: Date,
    description: 'Release date',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDate({ message: 'releaseDate must be yyyy-MM-dd' })
  @ToDateTime()
  releaseDate!: Date;

  @ApiPropertyOptional({
    type: Date,
    description: 'End date',
    example: '2025-03-01',
  })
  @IsOptional()
  @IsDate({ message: 'endDate must be yyyy-MM-dd' })
  @ToDateTime()
  endDate?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Minimum age',
    example: 'P',
  })
  @IsOptional()
  @IsString()
  ratingAge?: string;

  @ApiPropertyOptional({ type: String, description: 'Country', example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Language',
    example: 'English',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Actors',
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actors?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Director',
    example: 'Christopher Nolan',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Producer',
    example: 'Emma Thomas',
  })
  @IsOptional()
  @IsString()
  producer?: string;
}
