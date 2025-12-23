import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordReqDto {
  @ApiProperty({
    type: String,
    description: 'Current password',
    example: 'current_password',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({
    type: String,
    description: 'New password',
    example: 'new_password',
  })
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
