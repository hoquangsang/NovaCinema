import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Theater } from "../schemas/theater.schema";


@Injectable()
export class TheaterRepository {
  constructor(
    @InjectModel(Theater.name)
    private readonly theaterModel: Model<Theater>
  ) {}

  findTheaterById(id: string) {
    return this.theaterModel
      .findById(id)
      .lean()
      .exec();
  }

  findAllTheaters() {
    return this.theaterModel
      .find()
      .lean()
      .exec();
  }
}