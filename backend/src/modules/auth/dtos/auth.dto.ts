import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserDto } from "src/modules/users/dtos";

export class AuthDto {
  @ApiProperty()
  @Expose()
  user!: UserDto

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @Expose()
  accessToken!: string;

  @ApiProperty({ example: 900 })
  @Expose()
  expiresIn!: number;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @Expose()
  refreshToken!: string;

  @ApiProperty({ example: 3600 })
  @Expose()
  refreshExpiresIn!: number;
}