import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/modules/users';
import { MoviesModule } from 'src/modules/movies';
import { TheatersModule } from 'src/modules/theaters';
import { ShowtimesModule } from 'src/modules/showtimes';
import { PricingConfigModule } from 'src/modules/pricing-configs';
import {
  Booking,
  BookingSchema,
  BookingSeat,
  BookingSeatSchema,
} from './schemas';
import {
  BookingCommandRepository,
  BookingQueryRepository,
  BookingRepository,
} from './repositories';
import { BookingService } from './services';
import { BookingsController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: BookingSeat.name, schema: BookingSeatSchema },
    ]),
    UsersModule,
    MoviesModule,
    TheatersModule,
    ShowtimesModule,
    PricingConfigModule,
  ],
  controllers: [BookingsController],
  providers: [
    BookingCommandRepository,
    BookingQueryRepository,
    BookingRepository,
    BookingService,
  ],
  exports: [BookingService],
})
export class BookingsModule {}
