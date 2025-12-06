import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepo: UserRepository
  ) {}

  findById(id: string) {
    return this.usersRepo.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  findPaginated(options: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }) {
    return this.usersRepo.findPaginated(options);
  }

  createUser(
    data: {
      email: string;
      password: string;
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: Date;
    }
  ) {
    return this.usersRepo.create(data);
  }
  
  updateById(
    id: string,
    updates: {
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: Date;
      emailVerified?: boolean;
      lastLogin?: Date;
    }
  ) {
    return this.usersRepo.updateById(id, updates);
  }

  updateLastLogin(id: string) {
    return this.updateById(id, {
      lastLogin: new Date(),
    });
  }

  markEmailVerified(id: string) {
    return this.updateById(id, {
      emailVerified: true,
    });
  }
  
  deleteById(id: string) {
    return this.usersRepo.deleteById(id);
  }
}
