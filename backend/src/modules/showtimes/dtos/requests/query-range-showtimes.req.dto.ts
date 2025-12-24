import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';
import { QueryRangeReqDto } from 'src/modules/base/dtos/requests';

export class QueryRangeShowtimesReqDto extends QueryRangeReqDto {
  declare search?: never;
  declare sort?: never;

  @ApiPropertyOptional({
    description: 'Filter by movie ID',
    example: '67a1234bcf90123456789def',
  })
  @IsOptional()
  @IsMongoId()
  movieId?: string;

  @ApiPropertyOptional({
    description: 'Filter by theater ID',
    example: '67b2234bcf90123456789aaa',
  })
  @IsOptional()
  @IsMongoId()
  theaterId?: string;

  @ApiPropertyOptional({
    description: 'Filter by room ID',
    example: '67c3334bcf90123456789bbb',
  })
  @IsOptional()
  @IsMongoId()
  roomId?: string;
}
