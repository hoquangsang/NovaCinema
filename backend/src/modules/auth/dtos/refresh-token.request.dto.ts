import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({ type: String, description: 'Refresh token to obtain new access token', example: 'refresh_token_here' })
  @IsString()
  refreshToken!: string;
}
