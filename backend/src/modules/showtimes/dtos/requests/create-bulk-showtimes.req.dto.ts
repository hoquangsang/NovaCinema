import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { ToDateTime } from 'src/common/decorators';

export class CreateBulkShowtimesReqDto {
  @ApiProperty({
    type: String,
    description: 'Movie ID for multiple showtimes',
    example: '67b0f3c65fa2c2c7a836a458',
  })
  @IsNotEmpty()
  @IsMongoId()
  movieId!: string;

  @ApiProperty({
    type: [String],
    description: 'Room IDs for multiple showtimes',
    example: ['67b0f3c65fa2c2c7a836a459', '67b0f3c65fa2c2c7a836a459'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  roomIds!: string[];

  @ApiProperty({
    type: [Date],
    description: 'Start datetimes for multiple showtimes',
    example: ['2025-12-20T09:00:00.000Z', '2025-12-20T11:30:00.000Z'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDate({ each: true })
  @ToDateTime()
  startAts!: Date[];
}
