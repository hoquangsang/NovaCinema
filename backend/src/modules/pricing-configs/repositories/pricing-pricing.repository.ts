import { Injectable } from '@nestjs/common';
import { PricingConfigQueryRepository } from './pricing-pricing.query.repository';
import { PricingConfigCommandRepository } from './pricing-config.command.repository';

@Injectable()
export class PricingConfigRepository {
  constructor(
    public readonly query: PricingConfigQueryRepository,
    public readonly command: PricingConfigCommandRepository,
  ) {}
}
