import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortFields } from 'src/common/types';
import { ToArray, ToBoolean, ToSortObject } from 'src/common/decorators';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from '../../constants';
import { RoomType } from '../../types';

export class PaginatedQueryRoomsReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Regex match: roomName',
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

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  /******************* */
  @ApiPropertyOptional({
    type: String,
    description: 'Filter by room name',
  })
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
  @IsArray()
  @ToArray()
  roomType?: RoomType[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be true or false' })
  @ToBoolean()
  isActive?: boolean;
}
