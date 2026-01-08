import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { ToDateTime } from 'src/common/decorators';
import { QueryReqDto } from './query.req.dto';

export class QueryRangeReqDto extends QueryReqDto {
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
}
