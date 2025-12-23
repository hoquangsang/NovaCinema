import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, Min } from 'class-validator';
import {
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_VALUES,
  DaysOfWeek,
} from 'src/common/types';

export class DaysOfWeekTicketPricingModifierReqDto {
  @ApiProperty({
    type: [String],
    description: 'Days of the week this modifier applies',
    enum: DAYS_OF_WEEK_VALUES,
    example: [DAYS_OF_WEEK.SAT, DAYS_OF_WEEK.SUN],
  })
  @IsArray()
  @IsEnum(DAYS_OF_WEEK_VALUES, {
    each: true,
    message: `Each value must be one of: ${DAYS_OF_WEEK_VALUES.join(', ')}`,
  })
  applicableDays!: DaysOfWeek[];

  @ApiProperty({
    type: Number,
    description: 'Price delta for the selected days',
    example: 15_000,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  deltaPrice!: number;
}
