import { Injectable } from "@nestjs/common";
import { TheaterRepository } from "../repositories/theater.repository";

@Injectable()
export class TheaterService {
  constructor(
    private readonly theaterRepo: TheaterRepository
  ) {}

  findTheaterById(id: string) {
    return this.theaterRepo.findById(id);
  }

  getAllTheaters() {
    return this.theaterRepo.findAll();
  }
}