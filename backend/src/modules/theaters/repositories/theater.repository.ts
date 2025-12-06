import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Theater, TheaterDocument } from "../schemas/theater.schema";
import { BaseRepository } from "src/modules/shared";


@Injectable()
export class TheaterRepository extends BaseRepository<Theater, TheaterDocument> {
  constructor(
    @InjectModel(Theater.name)
    private readonly theaterModel: Model<TheaterDocument>
  ) {
    super(theaterModel);
  }

  findById(id: string) {
    return super.findById(id);
  }

  findAll() {
    return super.findAll();
  }

  create(data: Partial<Theater>) {
    return super.create(data);  
  }

  deleteById(id: string) {
    return super.deleteById(id);
  }
}
