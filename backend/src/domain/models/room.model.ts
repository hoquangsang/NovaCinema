/**
 * Domain Model: Room
 * Represents a screening room within a theater
 */

export class Room {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly theaterId: string,
    public readonly capacity: number,
    public readonly type: 'standard' | '3d' | 'imax' | 'vip',
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Check if room is available for booking
   */
  isAvailable(): boolean {
    return this.isActive;
  }

  /**
   * Check if room supports 3D
   */
  supports3D(): boolean {
    return this.type === '3d' || this.type === 'imax';
  }
}
