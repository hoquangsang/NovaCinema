import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterRequestDto {
  @ApiProperty({ type: String, description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, description: 'User password', example: 'password123' })
  @MinLength(6)
  @IsString()
  password!: string;

  @ApiPropertyOptional({ type: String, description: 'User phone number', example: '0123456789' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String, description: 'Username', example: 'user123' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ type: String, description: 'Full name of the user', example: 'Full Name' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ type: String, description: 'Date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;
}
