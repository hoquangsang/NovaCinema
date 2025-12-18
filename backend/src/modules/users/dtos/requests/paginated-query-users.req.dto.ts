import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginatedQueryReqDto } from 'src/modules/base/dtos/requests';
import { USER_ROLE_VALUES, USER_ROLES } from '../../constants';
import { UserRoleType } from '../../types';

export class PaginatedQueryUsersReqDto extends PaginatedQueryReqDto {
  @ApiPropertyOptional({ type: String, description: 'Filter by email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    type: [String],
    enum: USER_ROLE_VALUES,
    description: 'Filter by user roles',
    example: USER_ROLES.USER,
  })
  @IsOptional()
  @IsEnum(USER_ROLE_VALUES, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined,
  )
  roles?: UserRoleType[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
