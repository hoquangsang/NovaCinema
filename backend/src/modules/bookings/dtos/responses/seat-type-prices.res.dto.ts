import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SeatTypePricesResDto {
  @ApiProperty({
    type: Number,
    description: 'Normal seat price',
    example: 50_000,
  })
  @Expose()
  NORMAL!: number;

  @ApiProperty({
    type: Number,
    description: 'VIP seat price',
    example: 90_000,
  })
  @Expose()
  VIP!: number;

  @ApiProperty({
    type: Number,
    description: 'Couple seat price',
    example: 140_000,
  })
  @Expose()
  COUPLE!: number;
}
