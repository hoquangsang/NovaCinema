/**
 * Domain Model: Theater
 * Represents a cinema theater/location
 */

export class Theater {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address: string,
    public readonly city: string,
    public readonly phoneNumber: string,
    public readonly facilities: string[],
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Check if theater is operational
   */
  isOperational(): boolean {
    return this.isActive;
  }

  /**
   * Get full address
   */
  getFullAddress(): string {
    return `${this.address}, ${this.city}`;
  }
}
