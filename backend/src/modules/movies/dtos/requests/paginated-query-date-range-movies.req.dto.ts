import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsISO8601, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginatedQueryMoviesReqDto } from './paginated-query-movies.req.dto';

export class PaginatedQueryDateRangeMoviesReqDto extends PaginatedQueryMoviesReqDto {
  @ApiPropertyOptional({
    description: 'Start date filter',
    example: '2025-12-12',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    type: Date,
    description: 'End date filter',
    example: '2025-12-20',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
