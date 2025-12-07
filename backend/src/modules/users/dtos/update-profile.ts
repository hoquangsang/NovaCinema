import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsDate, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class UpdateProfileDto {
  @ApiProperty({ example: "0123456789", required: false })
  @IsOptional()
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty({ example: "user123" })
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ example: "Full Name" })
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @ApiProperty({ type: String,  example: "1990-01-01", required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;
}
