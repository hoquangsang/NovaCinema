import { IsDate, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123" })
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: "0123456789", required: false })
  @IsOptional()
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty({ example: "user123" })
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ example: "Full Name" })
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @ApiProperty({ type: String,  example: "1990-01-01", required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;
}