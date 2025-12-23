import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateShowtimeValidationResDto {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates whether the create showtime request is valid',
    example: true,
  })
  @Expose()
  valid!: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Field that failed validation (if applicable)',
    example: 'movieId',
  })
  @Expose()
  field?: string;

  @ApiProperty({
    type: [String],
    description: 'Validation error messages for the field',
    example: ['Movie not found', 'Another error message'],
  })
  @Expose()
  errors!: string[];

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional top-level message describing the validation result',
    example: 'Validation failed',
  })
  @Expose()
  message?: string;
}
