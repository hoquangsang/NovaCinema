import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryRequestDto } from "src/modules/base/dtos/query.request.dto";

export class QueryTheatersRequestDto extends QueryRequestDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by theater name' })
  @IsOptional()
  @IsString()
  theaterName?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by theater address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by hotline number' })
  @IsOptional()
  @IsString()
  hotline?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Filter by active status' })
  @IsOptional()
  isActive?: boolean;
}