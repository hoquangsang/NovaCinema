import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({ example: "refresh_token_here" })
  @IsNotEmpty()
  refreshToken!: string;
}
