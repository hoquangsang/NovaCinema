import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsBoolean } from "class-validator";
import { UpdateProfileDto } from "./update-profile";

export class UpdateUserDto extends UpdateProfileDto {
  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
