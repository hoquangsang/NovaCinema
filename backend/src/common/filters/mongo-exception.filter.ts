import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';
import { ErrorResponse } from '../responses';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      const error = new ErrorResponse(
        'Duplicate key error',
        400,
        undefined,
        exception.keyValue,
      );
      res.status(400).json(error);
      return;
    }

    throw exception;
  }
}
