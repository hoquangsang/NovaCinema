import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Theater ID where the room belongs to', example: '67b0f3c65fa2c2c7a836a458' })
  @IsNotEmpty()
  @IsString()
  theaterId!: string;

  @ApiProperty({ description: 'Name of the room', example: 'Room 1' })
  @IsNotEmpty()
  @IsString()
  roomName!: string;

  @ApiProperty({ description: 'Number of seat rows in the room', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  rowCount!: number;

  @ApiProperty({ description: 'Number of seats per row', example: 8 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  seatsPerRow!: number;
}
