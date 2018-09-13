import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../../shared/api.interfaces';
import { ConfigurationErrorResult, ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetSwaggerResult } from './swagger.interfaces';
import { SwaggerService } from './swagger.service';

export class SwaggerController {
  public constructor(private readonly _service: SwaggerService) {
  }

  public getSwaggerJson: ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback): void => {
    this._service.getSwaggerDescription()
      .then((result: GetSwaggerResult) => {
        return ResponseBuilder.ok<GetSwaggerResult>(result, callback);  // tslint:disable-line arrow-return-shorthand
      })
      .catch((error: ErrorResult) => {
        if (error instanceof NotFoundResult) {
          return ResponseBuilder.notFound(error.code, error.description, callback);
        }

        if (error instanceof ForbiddenResult) {
          return ResponseBuilder.forbidden(error.code, error.description, callback);
        }

        if (error instanceof ConfigurationErrorResult) {
          return ResponseBuilder.configurationError(error.code, error.description, callback);
        }

        return ResponseBuilder.internalServerError(error, callback);
      });

  }
}
