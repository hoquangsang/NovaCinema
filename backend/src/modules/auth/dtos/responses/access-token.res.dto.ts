import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccessTokenResDto {
  @ApiProperty({
    type: String,
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
  })
  @Expose()
  accessToken!: string;

  @ApiProperty({
    type: Number,
    description: 'Token expiry in seconds',
    example: 900,
  })
  @Expose()
  expiresIn!: number;
}
