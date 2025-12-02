import { PipeTransform, BadRequestException } from "@nestjs/common";

export class ParseIntPipe implements PipeTransform {
  transform(value: any) {
    const num = parseInt(value, 10);
    if (isNaN(num)) throw new BadRequestException("Invalid number");
    return num;
  }
}
