import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { USER_ROLES } from '../../constants';
import { UserRoleType } from '../../types';

export class UserResDto {
  @ApiProperty({ type: String, description: 'User unique ID' })
  @Expose()
  _id!: string;

  @ApiProperty({ type: String, description: 'User email address' })
  @Expose()
  email!: string;

  @ApiProperty({ type: Boolean, description: 'Email verified status' })
  @Expose()
  emailVerified!: boolean;

  @ApiPropertyOptional({ type: String, description: 'Username' })
  @Expose()
  username?: string;

  @ApiPropertyOptional({ type: String, description: 'Full name' })
  @Expose()
  fullName?: string;

  @ApiPropertyOptional({ type: String, description: 'Phone number' })
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String, description: 'Date of birth' })
  @Expose()
  dateOfBirth?: Date;

  @ApiProperty({
    type: [String],
    description: 'Roles assigned to the user',
    example: [USER_ROLES.USER],
  })
  @Expose()
  roles!: UserRoleType[];

  @ApiPropertyOptional({ type: Boolean, description: 'User active status' })
  @Expose()
  active?: boolean;

  @ApiPropertyOptional({ type: String, description: 'Last login time' })
  @Expose()
  lastLoginAt?: Date;

  @ApiPropertyOptional({ type: String, description: 'User created timestamp' })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String, description: 'User updated timestamp' })
  @Expose()
  updatedAt?: Date;
}
