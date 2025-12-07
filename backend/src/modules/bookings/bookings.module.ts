/**
 * Bookings Module
 * Complete module for ticket booking functionality
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BookingRepository } from './repositories/booking.repository';
import { BookingService } from './services/booking.service';
import { BookingsController } from './controllers/bookings.controller';

// Import use cases
import {
  CreateBookingUseCase,
  ConfirmBookingUseCase,
  CancelBookingUseCase,
} from '@/application/use-cases/booking';

// Import dependencies
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { TheatersModule } from '../theaters/theaters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
    ]),
    ShowtimesModule,
    TheatersModule,
  ],
  controllers: [BookingsController],
  providers: [
    BookingRepository,
    BookingService,
    CreateBookingUseCase,
    ConfirmBookingUseCase,
    CancelBookingUseCase,
  ],
  exports: [BookingRepository, BookingService],
})
export class BookingsModule {}
