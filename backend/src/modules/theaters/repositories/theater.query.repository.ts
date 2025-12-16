import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {  QueryRepository } from "src/modules/base/repositories";
import { Theater, TheaterDocument } from "../schemas/theater.schema";

@Injectable()
export class TheaterQueryRepository extends QueryRepository<Theater, TheaterDocument> {
  public constructor(
    @InjectModel(Theater.name)
    protected readonly theaterModel: Model<TheaterDocument>
  ) {
    super(theaterModel);
  }
}
