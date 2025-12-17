import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedQueryMoviesReqDto } from './paginated-query-movies.req.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedQueryRangeMoviesReqDto extends PaginatedQueryMoviesReqDto {
  @ApiPropertyOptional({ description: 'Start date filter' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start?: Date;

  @ApiPropertyOptional({ type: Date, description: 'End date filter' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end?: Date;
}
