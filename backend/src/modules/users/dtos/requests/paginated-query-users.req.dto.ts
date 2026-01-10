import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortFields } from 'src/common/types';
import { ToArray, ToBoolean, ToSortObject } from 'src/common/decorators';
import { USER_ROLE_VALUES, USER_ROLES } from '../../constants';
import { UserRole } from '../../types';

export class PaginatedQueryUsersReqDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Regex match: username, fullName, email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Sort orders',
    example: ['username:asc'],
  })
  @IsOptional()
  @ToSortObject()
  sort?: SortFields;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  /******************* */
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
  roles?: UserRole[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be true or false' })
  @ToBoolean()
  isActive?: boolean;
}
