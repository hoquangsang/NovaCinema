import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginatedQueryRequestDto } from 'src/modules/base/dtos';
import { USERROLE_TYPES, UserRoleType } from '../constants';
import { Transform } from 'class-transformer';

export class PaginatedQueryUsersRequestDto extends PaginatedQueryRequestDto {
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

  @ApiPropertyOptional({ type: [String], description: 'Filter by user roles' })
  @IsOptional()
  @IsEnum(USERROLE_TYPES, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined
  )
  roles?: UserRoleType[];

  @ApiPropertyOptional({ type: Boolean, description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
