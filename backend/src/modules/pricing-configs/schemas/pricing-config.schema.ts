import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PricingModifiers } from './pricing-modifier.schema';

export type PricingConfigDocument = HydratedDocument<PricingConfig>;

@Schema({ timestamps: true })
export class PricingConfig {
  @Prop({ type: Number, min: 0, required: true })
  basePrice!: number;

  @Prop({ default: {} })
  modifiers!: PricingModifiers;
}

export const PricingConfigSchema = SchemaFactory.createForClass(PricingConfig);
