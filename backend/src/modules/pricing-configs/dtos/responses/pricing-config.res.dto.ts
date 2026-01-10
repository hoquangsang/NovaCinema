import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PricingModifiersResDto } from './pricing-modifiers.res.dto';

export class PricingConfigResDto {
  @ApiProperty({
    type: Number,
    description: 'Base price of the ticket',
    example: 50_000,
  })
  @Expose()
  basePrice!: number;

  @ApiProperty({
    type: PricingModifiersResDto,
    description: 'Pricing modifiers for this ticket',
  })
  @Expose()
  @Type(() => PricingModifiersResDto)
  modifiers!: PricingModifiersResDto;

  @ApiPropertyOptional({
    type: String,
    description: 'Pricing creation timestamp',
    example: '2025-01-10T09:15:00.000Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Pricing last update timestamp',
    example: '2025-12-01T16:20:00.000Z',
  })
  @Expose()
  updatedAt?: Date;
}
