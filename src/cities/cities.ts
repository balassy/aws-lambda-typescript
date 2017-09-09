import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../../shared/api.interfaces';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetCityResult } from './cities.interfaces';

export const getCity: ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback): void => {
  // Input validation.
  if (event.pathParameters && event.pathParameters.id && +event.pathParameters.id < 0) {
    ResponseBuilder.returnNotFound('INVALID_CITY_ID', 'There is no city with the specified ID!', callback);
    return;
  }

  const result: GetCityResult = {
    city: process.env.FAVORITE_CITY,
    id: event.pathParameters ? +event.pathParameters.id : undefined,
    randomNumber: Math.random()
  };

  ResponseBuilder.returnOk<GetCityResult>(result, callback);
};
