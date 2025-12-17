import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedQueryReqDto } from 'src/modules/base/dtos/requests';

export class PaginatedQueryTheatersReqDto extends PaginatedQueryReqDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by theater name' })
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
  isActive?: boolean;
}
