export interface BaseResponse<T> {
  status: number;
  message: string;
  data?: T;
  error?: string | string[];
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
  };
}
