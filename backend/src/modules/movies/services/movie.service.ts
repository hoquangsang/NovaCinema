import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly repo: MovieRepository
  ) {}

  async getShowingMovies(page: number, limit: number) {
    return this.repo.findShowingMovies(page, limit);
  }

  async getUpcomingMovies(page: number, limit: number) {
    return this.repo.findUpcomingMovies(page, limit);
  }

  async getMovieById(id: string) {
    const movie = await this.repo.findMovieById(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }
}
