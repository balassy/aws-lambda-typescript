import { APIGatewayEvent, Context, ProxyCallback, ProxyHandler, ProxyResult } from 'aws-lambda';

const HTTP_OK: number = 200;

const hello: ProxyHandler = (event: APIGatewayEvent, context: Context, callback: ProxyCallback): void => {
  const result: HelloResult = {
    city: process.env.FAVORITE_CITY || '',
    randomNumber: Math.random()
  };

  const response: ProxyResult = {
    body: JSON.stringify(result),
    statusCode: HTTP_OK
  };

  callback(undefined, response);
};

export { hello };

export interface HelloResult {
  city: string;
  randomNumber: number;
}
