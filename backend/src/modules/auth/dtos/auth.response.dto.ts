import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dtos';

export class AuthResponseDto {
  @ApiProperty({ type: () => UserResponseDto, description: 'User information' })
  @Expose()
  user!: UserResponseDto;

  @ApiProperty({ type: String, description: 'JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @Expose()
  accessToken!: string;

  @ApiProperty({ type: Number, description: 'Access token expiry in seconds', example: 900 })
  @Expose()
  expiresIn!: number;

  @ApiProperty({ type: String, description: 'JWT refresh token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @Expose()
  refreshToken!: string;

  @ApiProperty({ type: Number, description: 'Refresh token expiry in seconds', example: 3600 })
  @Expose()
  refreshExpiresIn!: number;
}
