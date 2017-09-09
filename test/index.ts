import { ApiContext, ApiEvent, ApiHandler, ApiResponse } from '../shared/api.interfaces';
import { ApiResponseParsed, PathParameter } from './test.interfaces';

type Caller = <T> (handler: ApiHandler, pathParameters?: PathParameter) => Promise<ApiResponseParsed<T>>;

// tslint:disable-next-line arrow-return-shorthand (Long function body.)
export const call: Caller = <T>(handler: ApiHandler, pathParameters?: PathParameter): Promise<ApiResponseParsed<T>> => {
  // tslint:disable-next-line typedef (Well-known constructor.)
  return new Promise((resolve, reject) => {
    const event: ApiEvent = <ApiEvent> {};
    if (pathParameters) {
      event.pathParameters = pathParameters;
    }

    handler(event, <ApiContext> {}, (error?: Error, result?: ApiResponse): void => {
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
