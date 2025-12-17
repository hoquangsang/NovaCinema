import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { QueryReqDto } from 'src/modules/base/dtos/requests';
import { ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class QueryRoomsReqDto extends QueryReqDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by room name' })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({ type: [String], description: 'Filter by room type' })
  @IsOptional()
  @IsIn(ROOM_TYPES, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined,
  )
  roomType?: RoomType[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  isActive?: boolean;
}
