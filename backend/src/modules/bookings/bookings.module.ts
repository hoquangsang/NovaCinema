import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/modules/users';
import { MoviesModule } from 'src/modules/movies';
import { TheatersModule } from 'src/modules/theaters';
import { ShowtimesModule } from 'src/modules/showtimes';
import { TicketPricingModule } from 'src/modules/ticket-pricing';
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
  BookingSeatCommandRepository,
  BookingSeatQueryRepository,
  BookingSeatRepository,
} from './repositories';
import { BookingSeatService, BookingService } from './services';
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
    TicketPricingModule,
  ],
  controllers: [BookingsController],
  providers: [
    BookingSeatCommandRepository,
    BookingSeatQueryRepository,
    BookingSeatRepository,
    BookingSeatService,

    BookingCommandRepository,
    BookingQueryRepository,
    BookingRepository,
    BookingService,
  ],
  exports: [BookingSeatService, BookingService],
})
export class BookingsModule {}
