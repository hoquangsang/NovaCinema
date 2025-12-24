import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  ArrayMinSize,
  Matches,
  IsDate,
  IsArray,
  IsMongoId,
  IsString,
} from 'class-validator';
import { ToDateTime } from 'src/common/decorators';
import { TIME_HH_MM_REGEX, TimeHHmm } from 'src/common/types';

export class CreateRepeatShowtimeReqDto {
  @ApiProperty({
    type: String,
    description: 'Movie ID for repeated showtimes',
    example: '67b0f3c65fa2c2c7a836a458',
  })
  @IsNotEmpty()
  @IsMongoId()
  movieId!: string;

  @ApiProperty({
    type: [String],
    description: 'Room IDs for repeated showtimes',
    example: ['67b0f3c65fa2c2c7a836a459', '67b0f3c65fa2c2c7a836a459'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  roomIds!: string[];

  @ApiProperty({
    type: [String],
    description: 'Dates to schedule repeated showtimes',
    example: ['2025-12-10', '2025-12-12'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDate({ each: true })
  @ToDateTime()
  repeatDates!: Date[];

  @ApiProperty({
    type: String,
    description: 'Start times for repeated showtimes',
    example: ['16:00', '22:00'],
    pattern: TIME_HH_MM_REGEX.source,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(TIME_HH_MM_REGEX, {
    each: true,
    message: 'startTime must be in HH:mm format (00:00 - 23:59)',
  })
  startTimes!: TimeHHmm[];
}
