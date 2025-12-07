/**
 * Movies API
 * API endpoints for movie operations
 */

import { apiClient, type PaginatedResponse } from '../client';

export interface Movie {
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

export interface QueryMoviesParams {
  page?: number;
  limit?: number;
}

export const moviesApi = {
  /**
   * Get currently showing movies
   */
  getShowingMovies: async (params?: QueryMoviesParams): Promise<PaginatedResponse<Movie>> => {
    const response = await apiClient.get('/movies/showing', { params });
    return response.data;
  },

  /**
   * Get upcoming movies
   */
  getUpcomingMovies: async (params?: QueryMoviesParams): Promise<PaginatedResponse<Movie>> => {
    const response = await apiClient.get('/movies/upcoming', { params });
    return response.data;
  },

  /**
   * Get movie by ID
   */
  getMovieById: async (id: string): Promise<Movie> => {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  },

  /**
   * Search movies
   */
  searchMovies: async (query: string, params?: QueryMoviesParams): Promise<PaginatedResponse<Movie>> => {
    const response = await apiClient.get('/movies/search', {
      params: { ...params, q: query },
    });
    return response.data;
  },
};
