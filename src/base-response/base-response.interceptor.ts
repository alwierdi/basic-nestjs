import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import {
  BaseResponse,
  createResponse,
  RESPONSE_MESSAGE_KEY,
} from 'src/base-response/base-response';

@Injectable()
export class BaseResponseInterceptor<T>
  implements NestInterceptor<T, BaseResponse<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponse<T>> {
    return next.handle().pipe(
      map((data: any) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const customMessage =
          this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ) || 'success';

        return createResponse(statusCode, customMessage, data);
      }),
    );
  }
}
