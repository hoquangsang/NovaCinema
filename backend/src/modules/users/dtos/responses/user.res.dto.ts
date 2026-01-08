import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { USER_ROLES } from '../../constants';
import { UserRole } from '../../types';

export class UserResDto {
  @ApiProperty({
    type: String,
    description: 'User unique ID',
    example: '64123abc456def7890',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    type: Boolean,
    description: 'Email verified status',
    example: true,
  })
  @Expose()
  emailVerified!: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Username',
    example: 'john_doe',
  })
  @Expose()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Full name',
    example: 'John Doe',
  })
  @Expose()
  fullName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Phone number in E.164 format',
    example: '+1234567890',
  })
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Date of birth',
    example: '1990-01-01',
  })
  @Expose()
  dateOfBirth?: Date;

  @ApiProperty({
    type: [String],
    description: 'Roles assigned to the user',
    example: [USER_ROLES.USER],
  })
  @Expose()
  roles!: UserRole[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'User active status',
    example: true,
  })
  @Expose()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Last login timestamp',
    example: '2025-12-20T14:35:00.000Z',
  })
  @Expose()
  lastLoginAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'User creation timestamp',
    example: '2025-01-10T09:15:00.000Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'User last update timestamp',
    example: '2025-12-01T16:20:00.000Z',
  })
  @Expose()
  updatedAt?: Date;
}
