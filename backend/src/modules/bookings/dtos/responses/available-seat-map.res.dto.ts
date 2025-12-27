import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AvailableSeatResDto } from './available-seat.res.dto';

export class AvailableSeatMapResDto {
  @ApiProperty({
    description: '2D seat map with booking state',
    example: [],
  })
  @Expose()
  @Type(() => AvailableSeatResDto)
  seatMap!: (AvailableSeatResDto | null)[][];
}
