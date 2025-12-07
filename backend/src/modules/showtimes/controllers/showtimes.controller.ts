/**
 * Showtimes Controller
 * API endpoints for showtime operations
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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShowtimeService } from '../services/showtime.service';
import {
  CreateShowtimeDto,
  UpdateShowtimeStatusDto,
  ShowtimeDto,
  QueryShowtimesDto,
} from '../dtos';
import { Public, Roles, WrapCreatedResponse, WrapOkResponse, WrapPaginatedResponse } from '@/common/decorators';

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @ApiOperation({ description: 'Get showtimes by movie' })
  @Public()
  @WrapPaginatedResponse({ dto: ShowtimeDto })
  @HttpCode(200)
  @Get()
  async getShowtimes(@Query() query: QueryShowtimesDto) {
    const { movieId, theaterId, date, page = 1, limit = 10 } = query;

    if (movieId && theaterId && !date) {
      // Get bookable showtimes
      const items = await this.showtimeService.getBookableShowtimes(movieId, theaterId);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length,
      };
    }

    if (theaterId && date) {
      // Get showtimes by theater and date
      const items = await this.showtimeService.getShowtimesByTheaterAndDate(theaterId, date);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length,
      };
    }

    if (movieId) {
      // Get showtimes by movie with pagination
      const result = await this.showtimeService.getShowtimesByMovie(movieId, page, limit);
      return {
        items: result.items,
        total: result.total,
        page,
        limit,
      };
    }

    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  @ApiOperation({ description: 'Get showtime by ID' })
  @Public()
  @WrapOkResponse({ dto: ShowtimeDto })
  @HttpCode(200)
  @Get(':id')
  async getShowtimeById(@Param('id') showtimeId: string) {
    const showtime = await this.showtimeService.getShowtimeById(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    return showtime;
  }

  @ApiOperation({ description: 'Create a new showtime (Admin only)' })
  @Roles('admin')
  @ApiBearerAuth()
  @WrapCreatedResponse({ dto: ShowtimeDto })
  @HttpCode(201)
  @Post()
  async createShowtime(@Body() dto: CreateShowtimeDto) {
    return this.showtimeService.createShowtime(dto);
  }

  @ApiOperation({ description: 'Update showtime status (Admin only)' })
  @Roles('admin')
  @ApiBearerAuth()
  @WrapOkResponse({ dto: ShowtimeDto, message: 'Showtime status updated successfully' })
  @HttpCode(200)
  @Patch(':id/status')
  async updateShowtimeStatus(
    @Param('id') showtimeId: string,
    @Body() dto: UpdateShowtimeStatusDto,
  ) {
    return this.showtimeService.updateShowtimeStatus(showtimeId, dto.status);
  }

  @ApiOperation({ description: 'Delete showtime (Admin only)' })
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  async deleteShowtime(@Param('id') showtimeId: string) {
    const success = await this.showtimeService.deleteShowtime(showtimeId);
    return { message: 'Showtime deleted successfully', success };
  }
}
