import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { TicketPricing, TicketPricingDocument } from '../schemas';

@Injectable()
export class TicketPricingCommandRepository extends CommandRepository<
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
