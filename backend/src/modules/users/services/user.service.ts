import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private usersRepo: UserRepository
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async createUser(
    data: {
      email: string;
      password: string;
      userName?: string;
    }) {
      return this.usersRepo.createUser(data);
    }
}
