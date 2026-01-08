import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { SortFields } from 'src/common/types';
import { ToBoolean, ToSortObject } from 'src/common/decorators';

export class QueryTheatersReqDto {
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
    example: ['roomName:asc'],
  })
  @IsOptional()
  @ToSortObject()
  sort?: SortFields;

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
