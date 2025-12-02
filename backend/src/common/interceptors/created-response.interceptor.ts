import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatedResponse } from '../responses';

@Injectable()
export class CreatedResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method !== 'POST') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data instanceof CreatedResponse) {
          return data;
        }

        return new CreatedResponse(data);
      }),
    );
  }
}
