import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserDto {
  @ApiProperty()
  @Expose()
  _id!: string;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  emailVerified!: boolean;

  @ApiProperty()
  @Expose()
  username?: string;

  @ApiProperty()
  @Expose()
  fullName?: string;

  @ApiProperty()
  @Expose()
  phoneNumber?: string;

  @ApiProperty()
  @Expose()
  dateOfBirth?: Date;

  @ApiProperty({ example: ['user'] })
  roles!: string[];

  @ApiProperty()
  @Expose()
  active!: boolean;

  @ApiProperty()
  @Expose()
  lastLogin?: Date;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}
