import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryRepository } from 'src/modules/base/repositories/query';
import { TicketPricing, TicketPricingDocument } from '../schemas';

@Injectable()
export class TicketPricingQueryRepository extends QueryRepository<
  TicketPricing,
  TicketPricingDocument
> {
  public constructor(
    @InjectModel(TicketPricing.name)
    protected readonly pricingPolicyModel: Model<TicketPricingDocument>,
  ) {
    super(pricingPolicyModel);
  }
}
