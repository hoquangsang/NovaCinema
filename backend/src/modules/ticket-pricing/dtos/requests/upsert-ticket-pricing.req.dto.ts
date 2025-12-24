import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketPricingModifiersReqDto } from './ticket-pricing-modifiers.req.dto';

export class UpsertTicketPricingReqDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Base price of the ticket',
    example: 50_000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    type: TicketPricingModifiersReqDto,
    description: 'Pricing modifiers for this ticket',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TicketPricingModifiersReqDto)
  modifiers?: TicketPricingModifiersReqDto;
}
