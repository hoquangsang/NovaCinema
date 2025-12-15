import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendOtpRequestDto {
  @ApiProperty({ type: String, description: 'User email address to resend OTP', example: 'user@example.com' })
  @IsEmail()
  email!: string;
}
