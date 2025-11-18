import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovieService } from '../services/movie.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly service: MovieService
  ) {}

  @ApiOperation({ operationId: 'showing' })
  @Get('showing')
  getShowingMovies(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.getShowingMovies(+page, +limit);
  }

  @ApiOperation({ operationId: 'upcoming' })
  @Get('upcoming')
  getUpcomingMovies(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.getUpcomingMovies(+page, +limit);
  }

  @ApiOperation({ operationId: 'detail' })
  @Get(':id')
  getMovieDetail(@Param('id') id: string) {
    return this.service.getMovieById(id);
  }
}
