import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccessTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @Expose()
  accessToken!: string;

  @ApiProperty({ example: 900 })
  @Expose()
  expiresIn!: number;
}
