import {Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public, Roles, WrapCreatedResponse, WrapNoContentResponse, WrapOkResponse, WrapPaginatedResponse } from 'src/common/decorators';
import { MovieService } from '../services/movie.service';
import {
  PaginatedQueryRangeMoviesRequestDto, PaginatedQueryMoviesRequestDto,
  CreateMovieRequestDto, UpdateMovieRequestDto,
  MovieResponseDto
} from '../dtos';

@Public()/////////////////// for test
@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly movieService: MovieService
  ) {}

  @ApiOperation({ description: 'Query movies' })
  @WrapPaginatedResponse({ dto: MovieResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getMovies(
    @Query() query: PaginatedQueryRangeMoviesRequestDto
  ) {
    return this.movieService.findMoviesPaginated(query);
  }

  @ApiOperation({ description: 'Query showing movies' })
  @WrapPaginatedResponse({ dto: MovieResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('showing')
  public async getShowingMovies(
    @Query() query: PaginatedQueryMoviesRequestDto
  ) {
    return this.movieService.findShowingMoviesPaginated(query);
  }

  @ApiOperation({ description: 'Query upcoming movies' })
  @WrapPaginatedResponse({ dto: MovieResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('upcoming')
  public async getUpcomingMovies(
    @Query() query: PaginatedQueryMoviesRequestDto
  ) {
    return this.movieService.findUpcomingMoviesPaginated(query);
  }

  @ApiOperation({ description: 'Get movie by ID' })
  @WrapOkResponse({ dto: MovieResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getMovieById(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    const existed = await this.movieService.findMovieById(id);
    if (!existed) throw new NotFoundException('Movie not found');
    return existed;
  }

  @ApiOperation({ description: 'Create new movie'})
  @WrapCreatedResponse({ dto: MovieResponseDto, message: 'Movie created successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createMovie(
    @Body() dto: CreateMovieRequestDto
  ) {
    return this.movieService.createMovie(dto)
  }

  @ApiOperation({ description: 'Update movie by ID' })
  @WrapOkResponse({ dto: MovieResponseDto, message: 'Movie updated successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  public async updateMovie(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateMovieRequestDto
  ) {
    return this.movieService.updateMovieById(id, dto);
  }

  @ApiOperation({ description: 'Hard delete movie'})
  @WrapNoContentResponse({ message: 'Movie deleted successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteMovie(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    return this.movieService.deleteMovieById(id);
  }
}
