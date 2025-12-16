import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryRequestDto } from './query.request.dto';

export class PaginatedQueryRequestDto extends QueryRequestDto {
  @ApiPropertyOptional({ type: Number, description: "Page number for pagination", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ type: Number, description: "Number of items per page", example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}
