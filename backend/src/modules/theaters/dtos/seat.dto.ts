import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SeatDto {
  @ApiProperty()
  @Expose()
  _id!: string;

  @ApiProperty()
  @Expose()
  roomId!: string;

  @ApiProperty()
  @Expose()
  seatCode!: string;
}
