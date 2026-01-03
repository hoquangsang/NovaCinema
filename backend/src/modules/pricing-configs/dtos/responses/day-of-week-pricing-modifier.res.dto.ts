import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DAYS_OF_WEEK, DayOfWeek } from 'src/common/types';

export class DayOfWeekPricingModifierResDto {
  @ApiProperty({
    type: String,
    description: 'Days of the week this modifier applies',
    example: DAYS_OF_WEEK.SUN,
  })
  @Expose()
  dayOfWeek!: DayOfWeek;

  @ApiProperty({
    type: Number,
    description: 'Price delta for the selected days',
    example: 15_000,
  })
  @Expose()
  deltaPrice!: number;
}
