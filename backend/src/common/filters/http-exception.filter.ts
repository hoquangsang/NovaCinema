import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ErrorResponse } from '../responses';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse() as any;

      const err = new ErrorResponse(
        body?.message || exception.message || 'Error occurred',
        status,
        req.url,
        body?.error || null,
      );

      return res.status(status).json(err);
    }

    const err = new ErrorResponse(
      exception?.message || 'Internal Server Error',
      500,
      req.url,
      exception,
    );
    return res.status(500).json(err);
  }
}
