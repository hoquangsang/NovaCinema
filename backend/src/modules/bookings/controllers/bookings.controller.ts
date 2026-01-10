import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import {
  CurrentUser,
  Public,
  RequireRoles,
  WrapOkResponse,
} from 'src/common/decorators';
import { USER_ROLES } from 'src/modules/users/constants';
import { JwtPayload } from 'src/modules/auth/types';
import { BookingService } from '../services';
import { CreateBookingReqDto } from '../dtos/requests';
import { BookingAvailabilityResDto, BookingResDto } from '../dtos/responses';

@ApiTags('Bookings')
@Controller()
export class BookingsController {
  public constructor(
    //
    private readonly bookingService: BookingService,
  ) {
    //
  }

  @ApiOperation({
    summary: 'Get booking details',
    description: 'Retrieve detailed information of a booking by its unique ID.',
  })
  @WrapOkResponse({ dto: BookingResDto })
  @HttpCode(HttpStatus.OK)
  @Get('bookings/:bookingId')
  public async getBooking(
    @Param('bookingId', ParseObjectIdPipe) bookingId: string,
  ) {
    const booking = await this.bookingService.findBookingById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  @ApiOperation({
    summary: 'Get booking availability for a showtime',
    description:
      'Returns seat availability map and seat type prices used to initialize a booking for the given showtime.',
  })
  @WrapOkResponse({ dto: BookingAvailabilityResDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('showtimes/:showtimeId/bookings/availability')
  public async getBookingAvailability(
    @Param('showtimeId', ParseObjectIdPipe) showtimeId: string,
  ) {
    return await this.bookingService.getBookingAvailability(showtimeId);
  }

  @ApiOperation({
    summary: 'Create a booking',
    description:
      'Creates a draft booking for the given showtime using selected seat codes.',
  })
  @WrapOkResponse({ dto: BookingResDto })
  @RequireRoles(USER_ROLES.USER)
  @HttpCode(HttpStatus.OK)
  @Post('showtimes/:showtimeId/bookings')
  public async createBooking(
    @Param('showtimeId', ParseObjectIdPipe) showtimeId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateBookingReqDto,
  ) {
    return await this.bookingService.createBooking(
      showtimeId,
      user.sub,
      body.selectedSeats,
    );
  }
}
