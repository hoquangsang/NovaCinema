import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketPricing, TicketPricingSchema } from './schemas';
import {
  TicketPricingCommandRepository,
  TicketPricingQueryRepository,
  TicketPricingRepository,
} from './repositories';
import { TicketPricingService } from './services';
import { TicketPricingController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: TicketPricing.name, schema: TicketPricingSchema },
    ]),
  ],
  controllers: [TicketPricingController],
  providers: [
    TicketPricingCommandRepository,
    TicketPricingQueryRepository,
    TicketPricingRepository,
    TicketPricingService,
  ],
  exports: [TicketPricingService],
})
export class TicketPricingModule {}
