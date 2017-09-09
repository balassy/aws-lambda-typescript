import { ApiResponse } from '../shared/api.interfaces';

export interface ApiResponseParsed<T> extends ApiResponse {
  parsedBody: T;
}

export interface PathParameter {
  [name: string]: string;
}
