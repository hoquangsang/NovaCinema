import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingConfig, PricingConfigSchema } from './schemas';
import {
  PricingConfigCommandRepository,
  PricingConfigQueryRepository,
  PricingConfigRepository,
} from './repositories';
import { PricingConfigService } from './services';
import { TicketPricingController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: PricingConfig.name, schema: PricingConfigSchema },
    ]),
  ],
  controllers: [TicketPricingController],
  providers: [
    PricingConfigCommandRepository,
    PricingConfigQueryRepository,
    PricingConfigRepository,
    PricingConfigService,
  ],
  exports: [PricingConfigService],
})
export class PricingConfigModule {}
