/**
 * Domain Model: Movie
 * Represents the core business entity for movies
 * This is a pure domain model without infrastructure dependencies
 */

export class Movie {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly genre: string[],
    public readonly duration: number,
    public readonly description: string,
    public readonly posterUrl: string,
    public readonly trailerUrl: string,
    public readonly releaseDate: Date,
    public readonly endDate: Date,
    public readonly ratingAge: number,
    public readonly country: string,
    public readonly language: string,
    public readonly actors: string[],
    public readonly director: string,
    public readonly producer: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Check if movie is currently showing
   */
  isCurrentlyShowing(): boolean {
    const now = new Date();
    return now >= this.releaseDate && now <= this.endDate;
  }

  /**
   * Check if movie is upcoming
   */
  isUpcoming(): boolean {
    const now = new Date();
    return now < this.releaseDate;
  }

  /**
   * Check if movie has ended
   */
  hasEnded(): boolean {
    const now = new Date();
    return now > this.endDate;
  }

  /**
   * Check if movie is suitable for given age
   */
  isSuitableForAge(age: number): boolean {
    return age >= this.ratingAge;
  }

  /**
   * Get formatted duration (e.g., "2h 30m")
   */
  getFormattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
