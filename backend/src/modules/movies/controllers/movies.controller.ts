import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MovieService } from '../services/movie.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly service: MovieService
  ) {}

  @Get('showing')
  getShowingMovies(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.getShowingMovies(+page, +limit);
  }

  @Get('upcoming')
  getUpcomingMovies(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.getUpcomingMovies(+page, +limit);
  }

  @Get(':id')
  getMovieDetail(@Param('id') id: string) {
    return this.service.getMovieById(id);
  }
}
