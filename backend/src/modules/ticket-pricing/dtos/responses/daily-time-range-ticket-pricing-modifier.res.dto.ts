import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TimeHHmm } from 'src/common/types';

export class DailyTimeRangeTicketPricingModifierResDto {
  @ApiProperty({
    type: String,
    description: 'Start time of the modifier (HH:mm)',
    example: '18:00',
  })
  @Expose()
  startTime!: TimeHHmm;

  @ApiProperty({
    type: String,
    description: 'End time of the modifier (HH:mm)',
    example: '22:00',
  })
  @Expose()
  endTime!: TimeHHmm;

  @ApiProperty({
    type: Number,
    description: 'Price delta for this time range',
    example: 10_000,
  })
  @Expose()
  deltaPrice!: number;
}
