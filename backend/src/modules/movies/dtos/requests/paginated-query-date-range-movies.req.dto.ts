import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { ToDateOnlyEnd, ToDateOnlyStart } from 'src/common/decorators';
import { PaginatedQueryMoviesReqDto } from './paginated-query-movies.req.dto';

export class PaginatedQueryDateRangeMoviesReqDto extends PaginatedQueryMoviesReqDto {
  @ApiPropertyOptional({
    description: 'Start date filter',
    example: '2025-12-12',
  })
  @IsOptional()
  @ToDateOnlyStart()
  @IsDate({ message: 'startDate must be yyyy-MM-dd' })
  startDate?: Date;

  @ApiPropertyOptional({
    type: Date,
    description: 'End date filter',
    example: '2025-12-20',
  })
  @IsOptional()
  @IsDate({ message: 'endDate must be yyyy-MM-dd' })
  @ToDateOnlyEnd()
  endDate?: Date;
}
