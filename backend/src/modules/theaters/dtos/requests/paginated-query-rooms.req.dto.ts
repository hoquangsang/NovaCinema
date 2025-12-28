import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToArray, ToBoolean } from 'src/common/decorators';
import { PaginatedQueryReqDto } from 'src/modules/base/dtos/requests';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from '../../constants';
import { RoomType } from '../../types';

export class PaginatedQueryRoomsReqDto extends PaginatedQueryReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Regex match: roomName',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
