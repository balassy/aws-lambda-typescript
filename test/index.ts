import { APIGatewayEvent, Context, ProxyHandler, ProxyResult } from 'aws-lambda';

export const HTTP_OK: number = 200;

export const call: Caller = (handler: ProxyHandler): Promise<ProxyResult> =>
  // tslint:disable-next-line typedef (Well-known constructor.)
  new Promise((resolve, reject) => {
    handler(<APIGatewayEvent> {}, <Context> {}, (error?: Error, result?: ProxyResult): void => {
      if (typeof result === 'undefined') {
        reject('No result was returned by the handler!');

        return;
      }

      resolve(result);
    });
  });

type Caller = (handler: ProxyHandler) => Promise<ProxyResult>;
