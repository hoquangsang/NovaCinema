import {
  BadRequestException,
  ValidationPipe as VP,
} from "@nestjs/common";

export class ValidationPipe extends VP {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        exposeUnsetFields: false,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: "Validation failed",
          error: errors.map((e) => ({
            field: e.property,
            errors: Object.values(e.constraints || {}),
          })),
        });
      },
    });
  }
}
