import { APIGatewayEvent, Context, ProxyHandler, ProxyResult } from 'aws-lambda';

export interface ProxyResultParsed<T> extends ProxyResult {
  parsedBody: T;
}

export interface PathParameter {
  [name: string]: string;
}

type Caller = <T> (handler: ProxyHandler, pathParameters?: PathParameter) => Promise<ProxyResultParsed<T>>;

// tslint:disable-next-line arrow-return-shorthand (Long function body.)
export const call: Caller = <T>(handler: ProxyHandler, pathParameters?: PathParameter): Promise<ProxyResultParsed<T>> => {
  // tslint:disable-next-line typedef (Well-known constructor.)
  return new Promise((resolve, reject) => {
    const event: APIGatewayEvent = <APIGatewayEvent> {};
    if (pathParameters) {
      event.pathParameters = pathParameters;
    }

    handler(event, <Context> {}, (error?: Error, result?: ProxyResult): void => {
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
