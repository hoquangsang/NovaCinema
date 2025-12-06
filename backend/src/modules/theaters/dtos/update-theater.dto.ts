import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTheaterDto {
  @ApiPropertyOptional({ description: 'Name of the theater', example: 'CGV Aeon Tan Phu' })
  @IsString()
  @IsOptional()
  theaterName?: string;

  @ApiPropertyOptional({ description: 'Address of the theater', example: '30 Tan Thang Street, Tan Phu District' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Hotline of the theater', example: '1900 6017' })
  @IsString()
  @IsOptional()
  hotline?: string;
}
