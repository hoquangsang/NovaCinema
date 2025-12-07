import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTheaterDto {
  @ApiProperty({ description: 'Name of the theater', example: 'BHD Star Bitexco' })
  @IsNotEmpty()
  @IsString()
  theaterName!: string;

  @ApiPropertyOptional({ description: 'Address of the theater', example: '2 Hai Trieu, District 1' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Hotline of the theater', example: '1900 2099' })
  @IsString()
  @IsOptional()
  hotline?: string;
}
