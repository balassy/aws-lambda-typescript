import { ApiResponse, ErrorResponseBody } from '../shared/api.interfaces';

export interface ApiResponseParsed<T> extends ApiResponse {
  parsedBody: T;
}

export interface ApiErrorResponseParsed extends ApiResponse {
  parsedBody: ErrorResponseBody;
}

export interface PathParameter {
  [name: string]: string;
}
