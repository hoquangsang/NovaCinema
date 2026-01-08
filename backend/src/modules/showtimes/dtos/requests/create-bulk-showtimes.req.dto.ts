import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { ToDateTime } from 'src/common/decorators';

class RoomScheduleReqDto {
  @ApiProperty({
    type: String,
    description: 'Room ID',
    example: '67b0f3c65fa2c2c7a836a459',
  })
  @IsMongoId()
  roomId!: string;

  @ApiProperty({
    type: [Date],
    description: 'Start datetimes for the showtimes in this room',
    example: ['2025-12-20T09:00:00.000Z', '2025-12-20T11:30:00.000Z'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDate({ each: true })
  @ToDateTime()
  startAts!: Date[];
}

export class CreateBulkShowtimesReqDto {
  @ApiProperty({
    type: [RoomScheduleReqDto],
    description: 'Schedules for multiple rooms',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RoomScheduleReqDto)
  schedules!: RoomScheduleReqDto[];
}
