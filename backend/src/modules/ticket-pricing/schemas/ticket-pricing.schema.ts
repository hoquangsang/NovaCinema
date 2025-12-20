import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TicketPricingModifiers } from './ticket-pricing-modifier.schema';

export type TicketPricingDocument = HydratedDocument<TicketPricing>;

@Schema({ timestamps: true })
export class TicketPricing {
  @Prop({ type: Number, min: 0, required: true })
  basePrice!: number;

  @Prop({ default: {} })
  modifiers!: TicketPricingModifiers;
}

export const TicketPricingSchema = SchemaFactory.createForClass(TicketPricing);
