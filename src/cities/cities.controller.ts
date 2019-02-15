import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import {  ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetCityResult } from './cities.interfaces';
import { CitiesService } from './cities.service';

export class CitiesController {
  public constructor(private readonly _service: CitiesService) {
  }

  public getCity: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback): Promise<void> => {
    // Input validation.
    if (!event.pathParameters || !event.pathParameters.id) {
      return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the city ID!', callback);
    }

    if (isNaN(+event.pathParameters.id)) {
      return ResponseBuilder.badRequest(ErrorCode.InvalidId, 'The city ID must be a number!', callback);
    }

    const id: number = +event.pathParameters.id;
    try {
      const result: GetCityResult = await this._service.getCity(id);
      return ResponseBuilder.ok<GetCityResult>(result, callback);
    } catch (error) {
        if (error instanceof NotFoundResult) {
          return ResponseBuilder.notFound(error.code, error.description, callback);
        }

        if (error instanceof ForbiddenResult) {
          return ResponseBuilder.forbidden(error.code, error.description, callback);
        }

       return ResponseBuilder.internalServerError(error, callback); // tslint:disable-line 
      }
  }
}
