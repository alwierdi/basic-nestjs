import { SetMetadata } from '@nestjs/common';

export interface BaseResponse<T> {
  status: number;
  message: string;
  data?: T;
  error?: string | string[];
  timestamp: string;
}

export function createResponse<T>(
  status: number,
  message: string,
  data?: T,
  error?: string | string[],
): BaseResponse<T> {
  return {
    status,
    message,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}

export const RESPONSE_MESSAGE_KEY = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
