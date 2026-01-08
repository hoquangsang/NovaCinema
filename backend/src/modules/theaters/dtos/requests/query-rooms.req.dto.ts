import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToArray, ToBoolean, ToSortObject } from 'src/common/decorators';
import { SortFields } from 'src/common/types';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class QueryRoomsReqDto {
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

  /******************* */
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
  @IsArray()
  @IsEnum(ROOM_TYPE_VALUES, { each: true })
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
