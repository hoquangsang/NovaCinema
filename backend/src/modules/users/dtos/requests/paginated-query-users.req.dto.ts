import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ToArray, ToBoolean } from 'src/common/decorators';
import { PaginatedQueryReqDto } from 'src/modules/base/dtos/requests';
import { USER_ROLE_VALUES, USER_ROLES } from '../../constants';
import { UserRoleType } from '../../types';

export class PaginatedQueryUsersReqDto extends PaginatedQueryReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Regex match: username, fullName, email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by email',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by username',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by full name',
  })
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
  @ToArray()
  roles?: UserRoleType[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be true or false' })
  @ToBoolean()
  isActive?: boolean;
}
