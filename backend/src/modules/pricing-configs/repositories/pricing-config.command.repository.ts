import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { PricingConfig, PricingConfigDocument } from '../schemas';

@Injectable()
export class PricingConfigCommandRepository extends CommandRepository<
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
