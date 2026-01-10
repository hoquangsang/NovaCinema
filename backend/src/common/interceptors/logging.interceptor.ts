import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerUtil } from '../utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    LoggerUtil.info(`Request: ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: (res) => {
          LoggerUtil.info(`Response: ${method} ${url} (${Date.now() - now}ms)`);
          // LoggerUtil.debug({ response: res });
        },
        error: (err) => {
          LoggerUtil.error(`Error: ${method} ${url} (${err.message || err})`);
        },
      }),
    );
  }
}
