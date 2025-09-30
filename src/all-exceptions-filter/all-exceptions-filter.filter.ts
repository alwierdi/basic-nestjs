import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch() // Tangkap semua jenis error
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: any = null;
    let message = 'Internal server error';

    // Case 1: ZodError (validasi)
    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
    }

    // Case 2: HttpException (bawaan NestJS)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = typeof resObj.message === 'string' ? resObj.message : message;
        errors = Array.isArray(resObj.errors) ? resObj.errors : null;
      }
    }

    // Case 3: Error biasa
    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    // Base Response
    response.status(status).json({
      code: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
