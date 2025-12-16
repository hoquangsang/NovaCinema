import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailRequestDto {
  @ApiProperty({ type: String, description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, description: 'OTP code for verification', example: '123456' })
  @IsNotEmpty()
  @Length(6, 6)
  @IsString()
  otp!: string;
}
