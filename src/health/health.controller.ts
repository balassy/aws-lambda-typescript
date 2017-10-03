import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../../shared/api.interfaces';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetHealthCheckDetailedResult, GetHealthCheckResult } from './health.interfaces';

export class HealthController {
  public getHealthCheck: ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback): void => {
    const result: GetHealthCheckResult = {
      success: true
    };

    ResponseBuilder.ok<GetHealthCheckResult>(result, callback);
  }

  public getHealthCheckDetailed: ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback): void => {
    const result: GetHealthCheckDetailedResult = {
      requestId: event.requestContext.requestId,
      success: true
    };

    ResponseBuilder.ok<GetHealthCheckDetailedResult>(result, callback);
  }
}
