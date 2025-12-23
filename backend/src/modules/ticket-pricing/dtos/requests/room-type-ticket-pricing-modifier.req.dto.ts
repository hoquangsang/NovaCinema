import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { ROOM_TYPE_VALUES, ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class RoomTypeTicketPricingModifierReqDto {
  @ApiProperty({
    type: String,
    description: 'Room type for pricing modifier',
    enum: ROOM_TYPE_VALUES,
    example: ROOM_TYPES._3D,
  })
  @IsEnum(ROOM_TYPE_VALUES)
  roomType!: RoomType;

  @ApiProperty({
    type: Number,
    description: 'Price delta for this room type',
    example: 30_000,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  deltaPrice!: number;
}
