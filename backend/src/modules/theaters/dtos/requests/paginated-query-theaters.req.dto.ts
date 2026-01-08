import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean, ToSortObject } from 'src/common/decorators';
import { SortFields } from 'src/common/types';

export class PaginatedQueryTheatersReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Regex match: theaterName, address',
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
    description: 'Filter by theater name',
  })
  @IsOptional()
  @IsString()
  theaterName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by theater address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by hotline number',
  })
  @IsOptional()
  @IsString()
  hotline?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be true or false' })
  @ToBoolean()
  isActive?: boolean;
}
