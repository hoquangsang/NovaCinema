import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/common/decorators';
import { QueryReqDto } from 'src/modules/base/dtos/requests';

export class QueryTheatersReqDto extends QueryReqDto {
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
  @IsBoolean({ message: 'isActive must be true or false' })
  @ToBoolean()
  isActive?: boolean;
}
