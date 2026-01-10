import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SortFields } from 'src/common/types';
import { ToArray, ToDateTime, ToSortObject } from 'src/common/decorators';

export class PaginatedQueryRangeMoviesReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Regex match: title, director, producer, genres, actors',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Sort orders',
    example: ['theaterName:asc'],
  })
  @IsOptional()
  @ToSortObject()
  sort?: SortFields;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    type: String,
    description:
      'Start date (yyyy-MM-dd, inclusive). Suggested format: yyyy-MM-dd',
    example: '2025-12-20',
  })
  @IsOptional()
  @IsDate({ message: 'from must be a date' })
  @ToDateTime()
  from?: Date;

  @ApiPropertyOptional({
    type: String,
    description:
      'End date (yyyy-MM-dd, inclusive). Suggested format: yyyy-MM-dd',
    example: '2025-12-30',
  })
  @IsOptional()
  @IsDate({ message: 'to must be a date' })
  @ToDateTime()
  to?: Date;

  /******************* */
  @ApiPropertyOptional({
    type: String,
    description: 'Filter by movie title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by director name',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by producer name',
  })
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by genres',
    example: ['Action', 'Sci-Fi'],
  })
  @IsOptional()
  @ToArray()
  genres?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by actors',
  })
  @IsOptional()
  @ToArray()
  actors?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Minimum age rating',
    example: 'P',
  })
  @IsOptional()
  @IsString()
  ratingAge?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by country',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by language',
  })
  @IsOptional()
  @IsString()
  language?: string;
}
