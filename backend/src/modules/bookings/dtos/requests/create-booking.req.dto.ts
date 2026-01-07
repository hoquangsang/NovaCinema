import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';
import { IsArray } from 'class-validator';

export class CreateBookingReqDto {
  @ApiProperty({
    type: [String],
    description: 'List of selected seat codes',
    example: ['A1', 'A2', 'B3'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  selectedSeats!: string[];
}
