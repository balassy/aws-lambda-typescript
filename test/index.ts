import { ApiContext, ApiEvent, ApiHandler, ApiResponse, ErrorResponseBody } from '../shared/api.interfaces';
import { ApiErrorResponseParsed, ApiResponseParsed, PathParameter } from './test.interfaces';

type SuccessCaller = <T> (handler: ApiHandler, pathParameters?: PathParameter) => Promise<ApiResponseParsed<T>>;
type FailureCaller = (handler: ApiHandler, pathParameters?: PathParameter) => Promise<ApiErrorResponseParsed>;

// tslint:disable-next-line arrow-return-shorthand (Long function body.)
export const callSuccess: SuccessCaller = <T>(handler: ApiHandler, pathParameters?: PathParameter): Promise<ApiResponseParsed<T>> => {
  // tslint:disable-next-line typedef (Well-known constructor.)
  return new Promise((resolve, reject) => {
    const event: ApiEvent = <ApiEvent> {};
    if (pathParameters) {
      event.pathParameters = pathParameters;
    }

    handler(event, <ApiContext> {}, (error?: Error | null | string, result?: ApiResponse): void => {
      if (typeof result === 'undefined') {
        reject('No result was returned by the handler!');
        return;
      }

      const parsedResult: ApiResponseParsed<T> = result as ApiResponseParsed<T>;
      parsedResult.parsedBody = JSON.parse(result.body) as T;
      resolve(parsedResult);
    });
  });
};

// tslint:disable-next-line arrow-return-shorthand (Long function body.)
export const callFailure: FailureCaller = (handler: ApiHandler, pathParameters?: PathParameter): Promise<ApiErrorResponseParsed> => {
  // tslint:disable-next-line typedef (Well-known constructor.)
  return new Promise((resolve, reject) => {
    const event: ApiEvent = <ApiEvent> {};
    if (pathParameters) {
      event.pathParameters = pathParameters;
    }

    handler(event, <ApiContext> {}, (error?: Error | null | string, result?: ApiResponse): void => {
      if (typeof result === 'undefined') {
        reject('No result was returned by the handler!');
        return;
      }

      const parsedResult: ApiErrorResponseParsed = result as ApiErrorResponseParsed;
      parsedResult.parsedBody = JSON.parse(result.body) as ErrorResponseBody;
      resolve(parsedResult);
    });
  });
};
