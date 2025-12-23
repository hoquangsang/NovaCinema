import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsOptional } from 'class-validator';
import { ToDateTime } from 'src/common/decorators';
import { QueryReqDto } from 'src/modules/base/dtos/requests';

export class QueryShowtimesByDateReqDto extends QueryReqDto {
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

  @ApiProperty({
    description: 'Showtimes date (yyyy-MM-dd)',
    example: '2025-12-20',
  })
  @IsDate({ message: 'date must be yyyy-MM-dd' })
  @ToDateTime()
  date!: Date;
}
