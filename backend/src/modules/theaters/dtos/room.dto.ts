import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoomDto {
  @ApiProperty()
  @Expose()
  _id!: string;

  @ApiProperty()
  @Expose()
  theaterId!: string;

  @ApiProperty()
  @Expose()
  roomName!: string;

  @ApiProperty()
  @Expose()
  capacity!: number;
}
