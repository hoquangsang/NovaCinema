import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/modules/bookings/schemas';
import { Showtime, ShowtimeSchema } from 'src/modules/showtimes';
import { User, UserSchema } from 'src/modules/users';
import { Theater, TheaterSchema, Room, RoomSchema } from 'src/modules/theaters/schemas';
import { Payment, PaymentSchema } from 'src/modules/payments/schemas';
import { Ticket, TicketSchema } from 'src/modules/tickets/schemas';
import { BookingSeederService } from './booking-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: User.name, schema: UserSchema },
      { name: Theater.name, schema: TheaterSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  providers: [BookingSeederService],
  exports: [BookingSeederService],
})
export class BookingSeederModule {}

