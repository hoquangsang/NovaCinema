import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SeatDto {
  @ApiProperty()
  @Expose()
  _id!: string;

  @ApiProperty()
  @Expose()
  theaterId!: string;

  @ApiProperty()
  @Expose()
  roomId!: string;

  @ApiProperty()
  @Expose()
  row!: number;

  @ApiProperty()
  @Expose()
  number!: number;

  @ApiProperty()
  @Expose()
  seatCode!: string;
}
