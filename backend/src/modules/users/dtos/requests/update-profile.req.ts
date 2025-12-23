import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ToDateTime } from 'src/common/decorators';

export class UpdateProfileReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'User phone number',
    example: '0123456789',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Username',
    example: 'user123',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Full name of the user',
    example: 'Full Name',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Date of birth',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDate({ message: 'dateOfBirth must be a valid date string' })
  @ToDateTime()
  dateOfBirth?: Date;
}
