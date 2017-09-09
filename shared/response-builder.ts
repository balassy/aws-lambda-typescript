import { ApiCallback, ApiResponse, ErrorResult } from './api.interfaces';
import { HttpStatusCode } from './http-status-codes';

/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
  /**
   * Returns a HTTP 404 Not Found response with the specified custom code and message in the reponse body as JSON.
   * @static
   * @param {string} code A computer-friendly custom error code.
   * @param {string} message A human-friendly custom error message.
   * @param {ApiCallback} callback The callback of the Lambda handler.
   * @memberof ResponseBuilder
   */
  public static returnNotFound(code: string, message: string, callback: ApiCallback): void {
    const errorResult: ErrorResult = {
      code,
      message
    };

    ResponseBuilder._returnAs<ErrorResult>(errorResult, HttpStatusCode.NotFound, callback);
  }

  /**
   * Returns a HTTP 200 OK response with the specified response as JSON in the body.
   * @static
   * @template T The type of the data in the response body.
   * @param {T} result The result data of the operation.
   * @param {ApiCallback} callback The callback of the Lambda handler.
   * @memberof ResponseBuilder
   */
  public static returnOk<T>(result: T, callback: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, HttpStatusCode.Ok, callback);
  }

  /**
   * Returns a HTTP response with the specified data in the body and the specified HTTP status code.
   * @private
   * @static
   * @template T The type of the data in the response body.
   * @param {T} result The result data of the operation.
   * @param {number} statusCode The HTTP status code of the response.
   * @param {ApiCallback} callback The callback of the Lambda handler.
   * @memberof ResponseBuilder
   */
  private static _returnAs<T>(result: T, statusCode: number, callback: ApiCallback): void {
    const response: ApiResponse = {
      body: JSON.stringify(result),
      statusCode
    };

    callback(undefined, response);
  }
}
