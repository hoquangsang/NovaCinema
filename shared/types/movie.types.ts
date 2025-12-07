/**
 * Shared Types: Movie
 * Types dùng chung giữa Backend và Frontend
 * CHỈ chứa type definitions, KHÔNG chứa logic
 */

export interface MovieDto {
  _id: string;
  title: string;
  genre: string[];
  duration: number;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  releaseDate: string;
  endDate: string;
  ratingAge: number;
  country: string;
  language: string;
  actors: string[];
  director: string;
  producer: string;
}

export interface CreateMovieDto {
  title: string;
  genre: string[];
  duration: number;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  releaseDate: string;
  endDate: string;
  ratingAge: number;
  country: string;
  language: string;
  actors: string[];
  director: string;
  producer: string;
}

export interface UpdateMovieDto {
  title?: string;
  genre?: string[];
  duration?: number;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  releaseDate?: string;
  endDate?: string;
  ratingAge?: number;
  country?: string;
  language?: string;
  actors?: string[];
  director?: string;
  producer?: string;
}

export interface QueryMoviesDto {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
}
