import { APIGatewayEvent, Context, ProxyCallback, ProxyHandler, ProxyResult } from 'aws-lambda';
import { HttpStatusCode } from '../shared/http-status-codes';

const hello: ProxyHandler = (event: APIGatewayEvent, context: Context, callback: ProxyCallback): void => {
  const result: HelloResult = {
    city: process.env.FAVORITE_CITY || '',
    randomNumber: Math.random()
  };

  const response: ProxyResult = {
    body: JSON.stringify(result),
    statusCode: HttpStatusCode.Ok
  };

  callback(undefined, response);
};

export { hello };

export interface HelloResult {
  city: string;
  randomNumber: number;
}
