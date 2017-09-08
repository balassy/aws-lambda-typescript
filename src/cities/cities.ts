import { APIGatewayEvent, Context, ProxyCallback, ProxyHandler, ProxyResult } from 'aws-lambda';

import { HttpStatusCode } from '../../shared/http-status-codes';
import { GetCityResponse } from './cities.interfaces';

export const getCity: ProxyHandler = (event: APIGatewayEvent, context: Context, callback: ProxyCallback): void => {
  const response: GetCityResponse = {
    city: process.env.FAVORITE_CITY,
    id: event.pathParameters ? +event.pathParameters.id : undefined,
    randomNumber: Math.random()
  };

  const result: ProxyResult = {
    body: JSON.stringify(response),
    statusCode: HttpStatusCode.Ok
  };

  callback(undefined, result);
};
