import { PipeTransform, BadRequestException } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException("Invalid ObjectId");
    }
    return value;
  }
}
