import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser, Public, WrapOkResponse } from 'src/common/decorators';
import { JwtPayload } from 'src/modules/auth/types';
import { BookingService } from '../services';
import {
  AvailableSeatMapResDto,
  BookingResDto,
  SeatTypePricesResDto,
} from '../dtos/responses';
import { CreateBookingReqDto } from '../dtos/requests';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  public constructor(
    //
    private readonly bookingService: BookingService,
  ) {
    //
  }

  @ApiOperation({ description: 'Get estimated ticket prices for a showtime' })
  @WrapOkResponse({ dto: SeatTypePricesResDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('showtimes/:showtimeId/ticket-prices')
  public async getSeatTypePrices(
    @Param('showtimeId', ParseObjectIdPipe) showtimeId: string,
  ) {
    return await this.bookingService.getSeatTypePrices(showtimeId);
  }

  @ApiOperation({ description: 'Get available seats for a showtime' })
  @WrapOkResponse({ dto: AvailableSeatMapResDto })
  @HttpCode(HttpStatus.OK)
  @Get('showtimes/:showtimeId/seats-available')
  public async getSeatsAvailable(
    @Param('showtimeId', ParseObjectIdPipe) showtimeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.bookingService.getAvailableSeats(showtimeId, user.sub);
  }

  @ApiOperation({ description: 'Create a booking for a showtime' })
  @WrapOkResponse({ dto: BookingResDto })
  @HttpCode(HttpStatus.OK)
  @Post('showtimes/:showtimeId')
  public async createBooking(
    @Param('showtimeId', ParseObjectIdPipe) showtimeId: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateBookingReqDto,
  ) {
    return this.bookingService.createBooking(
      showtimeId,
      user.sub,
      body.selectedSeatCodes,
    );
  }
}
