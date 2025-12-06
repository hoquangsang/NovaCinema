import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieDto {
  @ApiProperty()
  @Expose()
  _id!: string;

  @ApiProperty()
  @Expose()
  title!: string;

  @ApiProperty({ type: [String] })
  @Expose()
  genre!: string[];

  @ApiProperty()
  @Expose()
  duration?: number;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty({ required: false })
  @Expose()
  posterUrl?: string;

  @ApiProperty({ required: false })
  @Expose()
  trailerUrl?: string;

  @ApiProperty()
  @Expose()
  releaseDate?: Date;

  @ApiProperty()
  @Expose()
  endDate?: Date;

  @ApiProperty({ required: false })
  @Expose()
  ratingAge?: number;

  @ApiProperty({ required: false })
  @Expose()
  country?: string;

  @ApiProperty({ required: false })
  @Expose()
  language?: string;

  @ApiProperty({ type: [String], required: false })
  @Expose()
  actors?: string[];

  @ApiProperty({ required: false })
  @Expose()
  director?: string;

  @ApiProperty({ required: false })
  @Expose()
  producer?: string;

  @ApiProperty()
  @Expose()
  createdAt?: Date;

  @ApiProperty()
  @Expose()
  updatedAt?: Date;
}
