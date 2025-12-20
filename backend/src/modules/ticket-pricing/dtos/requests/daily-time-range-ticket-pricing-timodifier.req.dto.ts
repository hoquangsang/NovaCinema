import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches, Min } from 'class-validator';
import { TIME_HH_MM_REGEX, TimeHHmm } from 'src/common/types';

export class DailyTimeRangeTicketPricingModifierReqDto {
  @ApiProperty({
    type: String,
    description: 'Start time of the modifier (HH:mm)',
    example: '18:00',
    pattern: TIME_HH_MM_REGEX.source,
  })
  @Matches(TIME_HH_MM_REGEX, {
    message: 'startTime must be in HH:mm format (00:00 - 23:59)',
  })
  @IsString()
  startTime!: TimeHHmm;

  @ApiProperty({
    type: String,
    description: 'End time of the modifier (HH:mm)',
    example: '22:00',
    pattern: TIME_HH_MM_REGEX.source,
  })
  @Matches(TIME_HH_MM_REGEX, {
    message: 'endTime must be in HH:mm format (00:00 - 23:59)',
  })
  @IsString()
  endTime!: TimeHHmm;

  @ApiProperty({
    type: Number,
    description: 'Price delta for this time range',
    example: 10_000,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  deltaPrice!: number;
}
