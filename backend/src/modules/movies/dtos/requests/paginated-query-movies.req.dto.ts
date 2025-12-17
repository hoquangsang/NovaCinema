import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined,
  )
  genres?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Filter by actors' })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined,
  )
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
