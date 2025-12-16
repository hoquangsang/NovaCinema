import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginatedQueryMoviesRequestDto } from "./paginated-query-movies.request.dto";
import { IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class PaginatedQueryRangeMoviesRequestDto extends PaginatedQueryMoviesRequestDto {
  @ApiPropertyOptional({  description: 'Start date filter' })
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
