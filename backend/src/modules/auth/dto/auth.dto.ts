import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123" })
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: "user123" })
  @IsOptional()
  @IsNotEmpty()
  userName?: string;
}

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123" })
  @MinLength(6)
  password!: string;
}
