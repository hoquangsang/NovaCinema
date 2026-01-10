import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsOptional } from 'class-validator';
import { SortFields } from 'src/common/types';
import { ToDateTime, ToSortObject } from 'src/common/decorators';

export class QueryShowtimesByDateReqDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Sort orders',
    example: ['startAt:asc'],
  })
  @IsOptional()
  @ToSortObject()
  sort?: SortFields;

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

  @ApiProperty({
    description: 'Showtimes date (yyyy-MM-dd)',
    example: '2025-12-20',
  })
  @IsDate({ message: 'date must be yyyy-MM-dd' })
  @ToDateTime()
  date!: Date;
}
