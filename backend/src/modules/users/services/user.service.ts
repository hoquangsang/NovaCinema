import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private usersRepo: UserRepository
  ) {}

  findById(id: string) {
    return this.usersRepo.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async createUser(
    data: {
      email: string;
      password: string;
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
    }
  ) {
    return this.usersRepo.createUser(data);
  }
  
  updateUserByEmail(
    email: string,
    updates: {
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
      lastLogin?: Date;
    }
  ) {
    return this.usersRepo.updateByFilter({ email }, updates);
  }

  markEmailVerified(email: string) {
    return this.usersRepo.markEmailVerified(email);
  }
}
