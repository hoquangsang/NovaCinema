/**
 * Domain Model: User
 * Represents a system user (customer or admin)
 */

export type UserRole = 'customer' | 'admin' | 'staff';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly phoneNumber: string,
    public readonly dateOfBirth: Date,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly isEmailVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  /**
   * Check if user is staff
   */
  isStaff(): boolean {
    return this.role === 'staff';
  }

  /**
   * Check if user is customer
   */
  isCustomer(): boolean {
    return this.role === 'customer';
  }

  /**
   * Check if user account is active and verified
   */
  canBook(): boolean {
    return this.isActive && this.isEmailVerified;
  }

  /**
   * Get user age
   */
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
