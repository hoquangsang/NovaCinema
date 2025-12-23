import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ROOM_TYPES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

export class RoomTypeTicketPricingModifierResDto {
  @ApiProperty({
    type: String,
    description: 'Room type for pricing modifier',
    example: ROOM_TYPES._3D,
  })
  @Expose()
  roomType!: RoomType;

  @ApiProperty({
    type: Number,
    description: 'Price delta for this room type',
    example: 30_000,
  })
  @Expose()
  deltaPrice!: number;
}
