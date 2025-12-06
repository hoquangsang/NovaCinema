import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/shared/dtos';

export class QueryUsersDto extends PaginationQueryDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: String, example: 'username:1,createdAt:-1' })
  @IsOptional()
  @IsString()
  sort?: string;
}
