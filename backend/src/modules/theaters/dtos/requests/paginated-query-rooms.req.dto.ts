import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginatedQueryReqDto } from 'src/modules/base/dtos/requests';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class PaginatedQueryRoomsReqDto extends PaginatedQueryReqDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by room name' })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({
    type: [String],
    enum: ROOM_TYPE_VALUES,
    description: 'Filter by room type',
    example: ROOM_TYPES._2D,
  })
  @IsOptional()
  @IsEnum(ROOM_TYPE_VALUES, { each: true })
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
