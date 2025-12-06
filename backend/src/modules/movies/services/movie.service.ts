import { Injectable } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly repo: MovieRepository
  ) {}

  findById(id: string) {
    return this.repo.findById(id);
  }

  findShowingMovies(page: number, limit: number) {
    return this.repo.findShowingMovies(page, limit);
  }

  findUpcomingMovies(page: number, limit: number) {
    return this.repo.findUpcomingMovies(page, limit);
  }

  createMovie(
    data: {
      title: string;
      genre: string[];
      duration?: number;
      description?: string;
      posterUrl?: string;
      trailerUrl?: string;
      releaseDate?: Date;
      endDate?: Date;
      ratingAge?: number;
      country?: string;
      language?: string;
      actors?: string[];
      director?: string;
      producer?: string;
    }
  ) {
    return this.repo.create(data);
  }

  deleteById(id: string) {
    return this.repo.deleteById(id);
  }
}
