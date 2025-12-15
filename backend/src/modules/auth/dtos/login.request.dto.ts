import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ type: String, description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, description: 'User password', example: 'password123' })
  @MinLength(6)
  password!: string;
}
