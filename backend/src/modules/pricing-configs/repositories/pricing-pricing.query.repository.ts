import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryRepository } from 'src/modules/base/repositories/query';
import { PricingConfig, PricingConfigDocument } from '../schemas';

@Injectable()
export class PricingConfigQueryRepository extends QueryRepository<
  PricingConfig,
  PricingConfigDocument
> {
  public constructor(
    @InjectModel(PricingConfig.name)
    protected readonly pricingPolicyModel: Model<PricingConfigDocument>,
  ) {
    super(pricingPolicyModel);
  }
}
