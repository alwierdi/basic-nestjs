import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { ERROR_MESSAGES } from './error-messages';

@Catch()
export class AllExceptions implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string = 'Internal Server Error';

    // Case 1: ZodError
    if (exception instanceof ZodError) {
      console.info(exception.issues);

      const formattedIssues = exception.issues.map((issue) => {
        const path = issue.path.join('.');
        return `${issue.message} in path ${path}`;
      });

      // jika ingin digabungkan menjadi 1 string
      // message = formattedIssues.join(', ');

      status = HttpStatus.BAD_REQUEST;
      message = `${exception.issues[0].message} in path ${exception.issues[0].path.join('.')}`;
      errors = 'Bad Request';
    }

    // Case 2: HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        if (typeof resObj.message === 'string') {
          message = resObj.message;
        } else if (Array.isArray(resObj.message)) {
          message = (resObj.message as string[]).join(', ');
        }
      }

      // map ke reason phrase
      errors = ERROR_MESSAGES[status] ?? 'Error';
    }

    // Case 3: Error biasa
    else if (exception instanceof Error) {
      message = exception.message || message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errors = 'Internal Server Error';
    }

    response.status(status).json({
      code: status,
      message,
      errors,
      // timestamp: new Date().toISOString(),
    });
  }
}
