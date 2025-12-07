import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: "refresh_token_here" })
  @IsNotEmpty()
  refreshToken!: string;
}
