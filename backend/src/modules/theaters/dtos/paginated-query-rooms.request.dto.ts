import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginatedQueryRequestDto } from "src/modules/base/dtos";
import { Transform } from "class-transformer";
import { ROOM_TYPES, RoomType } from "../constants";

export class PaginatedQueryRoomsRequestDto extends PaginatedQueryRequestDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by room name' })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({ type: [String], description: 'Filter by room type'})
  @IsOptional()
  @IsIn(ROOM_TYPES, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined
  )
  roomType?: RoomType[];

  @ApiPropertyOptional({ type: Boolean, description: 'Filter by active status' })
  @IsOptional()
  isActive?: boolean;
}
