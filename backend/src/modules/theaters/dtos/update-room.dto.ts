import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateRoomDto {
  @ApiPropertyOptional({ description: 'Number of seat rows in the room', example: 10 })
  @IsNumber()
  @IsOptional()
  rowCount?: number;

  @ApiPropertyOptional({ description: 'Number of seats per row', example: 8 })
  @IsNumber()
  @IsOptional()
  seatsPerRow?: number;
}
