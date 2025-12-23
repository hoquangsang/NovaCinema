import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNotEmpty } from 'class-validator';
import { ToDateTime } from 'src/common/decorators';

export class CreateShowtimeReqDto {
  @ApiProperty({
    description: 'Movie ID for this showtime',
    example: '67b0f3c65fa2c2c7a836a458',
  })
  @IsNotEmpty()
  @IsMongoId()
  movieId!: string;

  @ApiProperty({
    description: 'Room ID for this showtime',
    example: '67b0f3c65fa2c2c7a836a459',
  })
  @IsNotEmpty()
  @IsMongoId()
  roomId!: string;

  @ApiProperty({
    type: Date,
    description: 'Datetime when showtime starts',
    example: '2025-12-20T09:30:00.000Z',
  })
  @IsDate()
  @ToDateTime()
  startAt!: Date;
}
