import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TheaterResDto {
  @ApiProperty({
    type: String,
    description: 'Theater ID',
    example: '64b0c2f8e1f2a3a5d6b7c8d0',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'Theater name',
    example: 'CGV Bitexco',
  })
  @Expose()
  theaterName!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Address',
    example: '2 Hai Trieu, District 1',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Hotline',
    example: '1900 2099',
  })
  @Expose()
  hotline?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Active status' })
  @Expose()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Creation timestamp',
    example: '2023-07-01T12:00:00Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Last update timestamp',
    example: '2023-07-15T12:00:00Z',
  })
  @Expose()
  updatedAt?: Date;
}
