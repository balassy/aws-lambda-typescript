import {  ApiResponse, ErrorResponseBody } from './api.interfaces';
import { ErrorCode } from './error-codes';
import { BadRequestResult, ConfigurationErrorResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from './errors';
import { HttpStatusCode } from './http-status-codes';

/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
  public static badRequest(code: string, description: string): ApiResponse {
    const errorResult: BadRequestResult = new BadRequestResult(code, description);
    return ResponseBuilder._returnAs<BadRequestResult>(errorResult, HttpStatusCode.BadRequest);
  }

  public static configurationError(code: string, description: string): ApiResponse {
    const errorResult: ConfigurationErrorResult = new ConfigurationErrorResult(code, description);
    return ResponseBuilder._returnAs<ConfigurationErrorResult>(errorResult, HttpStatusCode.ConfigurationError);
  }

  public static forbidden(code: string, description: string): ApiResponse {
    const errorResult: ForbiddenResult = new ForbiddenResult(code, description);
    return ResponseBuilder._returnAs<ForbiddenResult>(errorResult, HttpStatusCode.Forbidden);
  }

  public static internalServerError(error: Error): ApiResponse {
    const errorResult: InternalServerErrorResult = new InternalServerErrorResult(ErrorCode.GeneralError, 'Sorry...');
    return ResponseBuilder._returnAs<InternalServerErrorResult>(errorResult, HttpStatusCode.InternalServerError);
  }

  public static notFound(code: string, description: string): ApiResponse {
    const errorResult: NotFoundResult = new NotFoundResult(code, description);
    return ResponseBuilder._returnAs<NotFoundResult>(errorResult, HttpStatusCode.NotFound);
  }

  public static ok<T>(result: T): ApiResponse {
    return ResponseBuilder._returnAs<T>(result, HttpStatusCode.Ok);
  }

  private static _returnAs<T>(result: T, statusCode: number): ApiResponse {
    const bodyObject: ErrorResponseBody | T = result instanceof ErrorResult
      ? { error: result }
      : result;
    const response: ApiResponse = {
      body: JSON.stringify(bodyObject),
      headers: {
        'Access-Control-Allow-Origin': '*'  // This is required to make CORS work with AWS API Gateway Proxy Integration.
      },
      statusCode
    };

    return response;
  }
}
