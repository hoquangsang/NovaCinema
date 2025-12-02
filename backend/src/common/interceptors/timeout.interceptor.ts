import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from "@nestjs/common";
import { timeout, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(5000),
      catchError(() => throwError(() => new RequestTimeoutException())),
    );
  }
}
