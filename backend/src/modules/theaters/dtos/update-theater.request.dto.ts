import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateTheaterRequestDto {
  @ApiPropertyOptional({ type: String, description: 'Theater name', example: 'CGV Aeon Tan Phu' })
  @IsOptional()
  @IsString()
  theaterName?: string;

  @ApiPropertyOptional({ type: String, description: 'Address', example: '30 Tan Thang Street, Tan Phu District' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: String, description: 'Hotline', example: '1900 6017' })
  @IsOptional()
  @IsString()
  hotline?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Active status', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
