import { APIGatewayEvent, Context, ProxyHandler, ProxyResult } from 'aws-lambda';

export const HTTP_OK: number = 200;

export interface ProxyResultParsed<T> extends ProxyResult {
  parsedBody: T;
}

type Caller = <T> (handler: ProxyHandler) => Promise<ProxyResultParsed<T>>;

// tslint:disable-next-line arrow-return-shorthand (Long function body.)
export const call: Caller = <T>(handler: ProxyHandler): Promise<ProxyResultParsed<T>> => {
  // tslint:disable-next-line typedef (Well-known constructor.)
  return new Promise((resolve, reject) => {
    handler(<APIGatewayEvent> {}, <Context> {}, (error?: Error, result?: ProxyResult): void => {
      if (typeof result === 'undefined') {
        reject('No result was returned by the handler!');

        return;
      }

      const parsedResult: ProxyResultParsed<T> = result as ProxyResultParsed<T>;
      parsedResult.parsedBody = JSON.parse(result.body) as T;

      resolve(parsedResult);
    });
  });
};
