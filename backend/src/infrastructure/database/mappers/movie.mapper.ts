/**
 * Data Mapper: Movie
 * Maps between database documents and domain models
 * Implements the Data Mapper pattern for separation of concerns
 */

import { Movie } from '@/domain/models';

export interface MovieDocument {
  _id: string;
  title: string;
  genre: string[];
  duration: number;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  releaseDate: Date;
  endDate: Date;
  ratingAge: number;
  country: string;
  language: string;
  actors: string[];
  director: string;
  producer: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MovieMapper {
  /**
   * Convert database document to domain model
   */
  static toDomain(doc: MovieDocument): Movie {
    return new Movie(
      doc._id.toString(),
      doc.title,
      doc.genre,
      doc.duration,
      doc.description,
      doc.posterUrl,
      doc.trailerUrl,
      new Date(doc.releaseDate),
      new Date(doc.endDate),
      doc.ratingAge,
      doc.country,
      doc.language,
      doc.actors,
      doc.director,
      doc.producer,
      new Date(doc.createdAt),
      new Date(doc.updatedAt),
    );
  }

  /**
   * Convert domain model to database document
   */
  static toPersistence(movie: Movie): Omit<MovieDocument, '_id' | 'createdAt' | 'updatedAt'> {
    return {
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      description: movie.description,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      releaseDate: movie.releaseDate,
      endDate: movie.endDate,
      ratingAge: movie.ratingAge,
      country: movie.country,
      language: movie.language,
      actors: movie.actors,
      director: movie.director,
      producer: movie.producer,
    };
  }

  /**
   * Convert array of documents to domain models
   */
  static toDomainArray(docs: MovieDocument[]): Movie[] {
    return docs.map(doc => this.toDomain(doc));
  }
}
