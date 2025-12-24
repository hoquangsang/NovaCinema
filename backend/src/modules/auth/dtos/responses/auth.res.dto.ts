import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResDto } from 'src/modules/users/dtos/responses';

export class AuthResDto {
  @ApiProperty({ type: () => UserResDto, description: 'User information' })
  @Expose()
  user!: UserResDto;

  @ApiProperty({
    type: String,
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
  })
  @Expose()
  accessToken!: string;

  @ApiProperty({
    type: Number,
    description: 'Access token expiry in seconds',
    example: 900,
  })
  @Expose()
  expiresIn!: number;

  @ApiProperty({
    type: String,
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
  })
  @Expose()
  refreshToken!: string;

  @ApiProperty({
    type: Number,
    description: 'Refresh token expiry in seconds',
    example: 3600,
  })
  @Expose()
  refreshExpiresIn!: number;
}
