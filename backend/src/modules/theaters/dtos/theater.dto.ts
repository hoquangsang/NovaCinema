import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TheaterDto {
  @ApiProperty()
  @Expose()
  _id!: string;

  @ApiProperty()
  @Expose()
  theaterName!: string;

  @ApiProperty({ required: false })
  @Expose()
  address?: string;

  @ApiProperty({ required: false })
  @Expose()
  hotline?: string;
}
