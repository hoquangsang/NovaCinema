import { Injectable } from '@nestjs/common';
import { TicketPricingQueryRepository } from './ticket-pricing.query.repository';
import { TicketPricingCommandRepository } from './ticket-pricing.command.repository';

@Injectable()
export class TicketPricingRepository {
  constructor(
    public readonly query: TicketPricingQueryRepository,
    public readonly command: TicketPricingCommandRepository,
  ) {}
}
