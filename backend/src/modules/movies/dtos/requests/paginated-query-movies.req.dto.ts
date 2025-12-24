import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ToArray } from 'src/common/decorators';
import { PaginatedQueryReqDto } from 'src/modules/base/dtos/requests';

export class PaginatedQueryMoviesReqDto extends PaginatedQueryReqDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by movie title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by director name' })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by producer name' })
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by genres',
    example: ['Action', 'Sci-Fi'],
  })
  @IsOptional()
  @ToArray()
  genres?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Filter by actors' })
  @IsOptional()
  @ToArray()
  actors?: string[];

  @ApiPropertyOptional({
    type: String,
    description: 'Minimum age rating',
    example: 'P',
  })
  @IsOptional()
  @IsString()
  ratingAge?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by language' })
  @IsOptional()
  @IsString()
  language?: string;
}
