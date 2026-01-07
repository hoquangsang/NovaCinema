import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { DAYS_OF_WEEK, DAYS_OF_WEEK_VALUES, DayOfWeek } from 'src/common/types';

export class DayOfWeekPricingModifierReqDto {
  @ApiProperty({
    type: String,
    description: 'Day of the week this modifier applies',
    enum: DAYS_OF_WEEK_VALUES,
    example: DAYS_OF_WEEK.SUN,
  })
  @IsEnum(DAYS_OF_WEEK_VALUES, {
    message: `Value must be one of: ${DAYS_OF_WEEK_VALUES.join(', ')}`,
  })
  dayOfWeek!: DayOfWeek;

  @ApiProperty({
    type: Number,
    description: 'Price delta applied for this day of week',
    example: 15_000,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  deltaPrice!: number;
}
