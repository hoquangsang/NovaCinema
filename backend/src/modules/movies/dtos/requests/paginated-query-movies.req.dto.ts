import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ToArray, ToSortObject } from 'src/common/decorators';
import { SortFields } from 'src/common/types';

export class PaginatedQueryMoviesReqDto {
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
