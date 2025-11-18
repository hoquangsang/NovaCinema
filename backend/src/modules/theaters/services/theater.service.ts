import { Injectable, NotFoundException } from "@nestjs/common";
import { TheaterRepository } from "../repositories/theater.repository";

@Injectable()
export class TheaterService {
  constructor(
    private readonly theaterRepo: TheaterRepository
  ) {}

  async getTheaterById(id: string) {
    const theater = await this.theaterRepo.findTheaterById(id);
    if (!theater)
      throw new NotFoundException('Theater not found');

    return theater;
  }

  getAllTheaters() {
    return this.theaterRepo.findAllTheaters();
  }
}