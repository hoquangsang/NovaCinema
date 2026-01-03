import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  PricingModifiers,
  PricingModifiersSchema,
} from './pricing-modifiers.schema';

export type PricingConfigDocument = HydratedDocument<PricingConfig>;

@Schema({ timestamps: true })
export class PricingConfig {
  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  basePrice!: number;

  @Prop({
    type: PricingModifiersSchema,
    default: {},
  })
  modifiers!: PricingModifiers;
}

export const PricingConfigSchema = SchemaFactory.createForClass(PricingConfig);
