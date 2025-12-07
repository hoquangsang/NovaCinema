/**
 * Showtime DTOs
 * Data Transfer Objects for showtime operations
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @ApiProperty({ description: 'Movie ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  movieId: string;

  @ApiProperty({ description: 'Room ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  roomId: string;

  @ApiProperty({ description: 'Theater ID', example: '507f1f77bcf86cd799439013' })
  @IsString()
  theaterId: string;

  @ApiProperty({ description: 'Start time', example: '2025-12-15T14:30:00Z' })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({ description: 'Movie duration in minutes', example: 120 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Base ticket price', example: 100000 })
  @IsNumber()
  @Min(0)
  basePrice: number;
}

export class UpdateShowtimeStatusDto {
  @ApiProperty({ 
    description: 'Showtime status',
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
  })
  @IsEnum(['scheduled', 'ongoing', 'completed', 'cancelled'])
  status: string;
}

export class ShowtimeDto {
  @ApiProperty({ description: 'Showtime ID' })
  id: string;

  @ApiProperty({ description: 'Movie ID' })
  movieId: string;

  @ApiProperty({ description: 'Room ID' })
  roomId: string;

  @ApiProperty({ description: 'Theater ID' })
  theaterId: string;

  @ApiProperty({ description: 'Start time' })
  startTime: Date;

  @ApiProperty({ description: 'End time' })
  endTime: Date;

  @ApiProperty({ description: 'Base price' })
  basePrice: number;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Available seats' })
  availableSeats: number;

  @ApiProperty({ description: 'Total seats' })
  totalSeats: number;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;
}

export class QueryShowtimesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  movieId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  theaterId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

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
