import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { SuccessResponse } from 'src/common/responses';
import { Public, Roles } from 'src/common/decorators';
import { MovieService } from '../services/movie.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly service: MovieService
  ) {}

  @ApiOperation({ operationId: 'showing' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Public()
  @Get('showing')
  async getShowingMovies(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    const { data, total } = await this.service.getShowingMovies(page, limit);
    return SuccessResponse.withPagination(data, total, page, limit);
  }

  @ApiOperation({ operationId: 'upcoming' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Public()
  @Get('upcoming')
  async getUpcomingMovies(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    const { data, total } = await this.service.getUpcomingMovies(page, limit);
    return SuccessResponse.withPagination(data, total, page, limit);
  }

  @ApiOperation({ operationId: 'detail' })
  @Public()
  @Get(':id')
  async getMovieDetail(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    const movie = await this.service.getMovieById(id);
    return SuccessResponse.of(movie);
  }
}
