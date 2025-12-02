import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ErrorResponse } from "../responses";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const body = exception.getResponse() as any;

    const err = new ErrorResponse(
      body.message || "Error occurred",
      status,
      req.url,
      body.error || null,
    );

    res.status(status).json(err);
  }
}
