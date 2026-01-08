import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SortFields } from 'src/common/types';
import { ToDateTime, ToSortObject } from 'src/common/decorators';

export class PaginatedQueryRangeShowtimesReqDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Sort orders',
    example: ['startAt:asc'],
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
    description: 'Filter by movie ID',
    example: '67a1234bcf90123456789def',
  })
  @IsOptional()
  @IsMongoId()
  movieId?: string;

  @ApiPropertyOptional({
    description: 'Filter by theater ID',
    example: '67b2234bcf90123456789aaa',
  })
  @IsOptional()
  @IsMongoId()
  theaterId?: string;

  @ApiPropertyOptional({
    description: 'Filter by room ID',
    example: '67c3334bcf90123456789bbb',
  })
  @IsOptional()
  @IsMongoId()
  roomId?: string;
}
