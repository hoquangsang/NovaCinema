import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async updateById(
    id: string,
    updates: {
      title?: string;
      genre?: string[];
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
    const existed = await this.repo.findById(id);
    if (!existed)
      throw new NotFoundException('Movie not found');
    
    const updated = await this.repo.updateById(id, updates);
    if (!updated)
      throw new BadRequestException('Update failed');
    
    return updated;
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
