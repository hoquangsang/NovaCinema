/**
 * Bookings Controller
 * API endpoints for booking operations
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from '../services/booking.service';
import {
  CreateBookingDto,
  ConfirmBookingDto,
  BookingDto,
  QueryBookingsDto,
} from '../dtos';
import { CurrentUser, Roles, WrapCreatedResponse, WrapOkResponse, WrapPaginatedResponse } from '@/common/decorators';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ description: 'Create a new booking' })
  @WrapCreatedResponse({ dto: BookingDto })
  @HttpCode(201)
  @Post()
  async createBooking(
    @Body() dto: CreateBookingDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingService.createBooking({
      userId,
      showtimeId: dto.showtimeId,
      seatIds: dto.seatIds,
    });
  }

  @ApiOperation({ description: 'Confirm booking after payment' })
  @WrapOkResponse({ dto: BookingDto, message: 'Booking confirmed successfully' })
  @HttpCode(200)
  @Patch(':id/confirm')
  async confirmBooking(
    @Param('id') bookingId: string,
    @Body() dto: ConfirmBookingDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.bookingService.confirmBooking(bookingId, dto.paymentId, userId);
  }

  @ApiOperation({ description: 'Cancel booking' })
  @WrapOkResponse({ dto: BookingDto, message: 'Booking cancelled successfully' })
  @HttpCode(200)
  @Delete(':id')
  async cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') userId: string,
  ) {
    const result = await this.bookingService.cancelBooking(bookingId, userId);
    return {
      ...result.booking,
      refundAmount: result.refundAmount,
    };
  }

  @ApiOperation({ description: 'Get user bookings' })
  @WrapPaginatedResponse({ dto: BookingDto })
  @HttpCode(200)
  @Get('my-bookings')
  async getMyBookings(
    @Query() query: QueryBookingsDto,
    @CurrentUser('sub') userId: string,
  ) {
    const { page = 1, limit = 10 } = query;
    const result = await this.bookingService.getUserBookings(userId, page, limit);
    
    return {
      items: result.items,
      total: result.total,
      page,
      limit,
    };
  }

  @ApiOperation({ description: 'Get booking by ID' })
  @WrapOkResponse({ dto: BookingDto })
  @HttpCode(200)
  @Get(':id')
  async getBookingById(@Param('id') bookingId: string) {
    const booking = await this.bookingService.getBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  @ApiOperation({ description: 'Get booking by code' })
  @WrapOkResponse({ dto: BookingDto })
  @HttpCode(200)
  @Get('code/:code')
  async getBookingByCode(@Param('code') code: string) {
    const booking = await this.bookingService.getBookingByCode(code);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  @ApiOperation({ description: 'Process expired bookings (Admin only)' })
  @Roles('admin')
  @HttpCode(200)
  @Post('process-expired')
  async processExpiredBookings() {
    const count = await this.bookingService.processExpiredBookings();
    return { message: `Processed ${count} expired bookings` };
  }
}
