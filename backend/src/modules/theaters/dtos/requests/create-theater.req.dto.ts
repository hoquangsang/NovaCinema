import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTheaterReqDto {
  @ApiProperty({
    type: String,
    description: 'Theater name',
    example: 'BHD Star Bitexco',
  })
  @IsNotEmpty()
  @IsString()
  theaterName!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Address',
    example: '2 Hai Trieu, District 1',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Hotline',
    example: '1900 2099',
  })
  @IsOptional()
  @IsString()
  hotline?: string;
}
