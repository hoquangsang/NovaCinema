import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsMongoId } from 'class-validator';

export class DeleteShowtimeReqDto {
  @ApiProperty({
    type: [String],
    description: 'Array of Showtime IDs to delete',
    example: ['67b0f3c65fa2c2c7a836a459', '67b0f3c65fa2c2c7a836a459'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  ids!: string[];
}
