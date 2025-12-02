import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { map } from "rxjs";
import { SuccessResponse } from "../responses";
import { META } from "../constants";
import { Reflector } from "@nestjs/core";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const message = this.reflector.get<string>(
      META.RESPONSE_MESSAGE,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => new SuccessResponse(data, message)),
    );
  }
}
