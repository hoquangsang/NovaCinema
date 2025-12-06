import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public, Roles, WrapCreatedResponse, WrapNoContentResponse, WrapOkResponse, WrapPaginatedResponse } from 'src/common/decorators';
import { MovieService } from '../services/movie.service';
import { CreateMovieDto, MovieDto, QueryMoviesDto, UpdateMovieDto } from '../dtos';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly service: MovieService
  ) {}

  @ApiOperation({ description: 'get showing movies' })
  @WrapPaginatedResponse({ dto: MovieDto })
  @Public()
  @HttpCode(200)
  @Get('showing')
  async getShowingMovies(
    @Query() query: QueryMoviesDto
  ) {
    const { page = 1, limit = 10 } = query;
    const { items, total } = await this.service.findShowingMovies(page, limit);
    return {
      items,
      total,
      page,
      limit
    }
  }

  @ApiOperation({ description: 'get upcoming movies' })
  @WrapPaginatedResponse({ dto: MovieDto })
  @Public()
  @HttpCode(200)
  @Get('upcoming')
  async getUpcomingMovies(
    @Query() query: QueryMoviesDto
  ) {
    const { page = 1, limit = 10 } = query;
    const { items, total } = await this.service.findUpcomingMovies(page, limit);
    return {
      items,
      total,
      page,
      limit
    }
  }

  @ApiOperation({ description: 'get movie by ID' })
  @WrapOkResponse({ dto: MovieDto })
  @Public()
  @HttpCode(200)
  @Get(':id')
  async getMovieById(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    const result = await this.service.findById(id);
    if (!result)
      throw new NotFoundException('Movie not found');
    return result;
  }

  @ApiOperation({ description: 'create new movie'})
  @WrapCreatedResponse({ dto: MovieDto })
  @Roles('admin')
  @HttpCode(200)
  @Post()
  async createMovie(
    @Body() dto: CreateMovieDto
  ) {
    return this.service.createMovie(dto)
  }

  @ApiOperation({ description: 'update movie by ID' })
  @WrapOkResponse({ dto: MovieDto, message: 'Movie updated successfully' })
  @Roles('admin')
  @HttpCode(200)
  @Patch(':id')
  async updateMovie(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateMovieDto
  ) {
    return this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete movie'})
  @WrapNoContentResponse({ message: 'Movie deleted successfully' })
  @Roles('admin')
  @HttpCode(204)
  @Delete(':id')
  async deleteMovie(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    return this.service.deleteById(id);
  }
}
