/**
 * Booking DTOs
 * Data Transfer Objects for booking operations
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsEnum, IsOptional, Min, ArrayMinSize } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Showtime ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  showtimeId: string;

  @ApiProperty({ 
    description: 'Array of seat IDs to book',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one seat must be selected' })
  @IsString({ each: true })
  seatIds: string[];
}

export class ConfirmBookingDto {
  @ApiProperty({ description: 'Payment ID from payment gateway', example: 'pay_abc123xyz' })
  @IsString()
  paymentId: string;
}

export class BookingDto {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Showtime ID' })
  showtimeId: string;

  @ApiProperty({ description: 'Booked seats' })
  seats: {
    seatId: string;
    row: string;
    number: number;
    type: string;
    price: number;
  }[];

  @ApiProperty({ description: 'Total amount' })
  totalAmount: number;

  @ApiProperty({ description: 'Booking status' })
  status: string;

  @ApiProperty({ description: 'Payment method' })
  paymentMethod: string | null;

  @ApiProperty({ description: 'Payment status' })
  paymentStatus: string;

  @ApiProperty({ description: 'Booking code' })
  bookingCode: string;

  @ApiProperty({ description: 'Expiration date' })
  expiresAt: Date;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}

export class QueryBookingsDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
