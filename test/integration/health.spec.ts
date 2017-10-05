import { expect } from 'chai';
import * as rp from 'request-promise-native';

import { HttpStatusCode } from '../../shared/http-status-codes';
import { GetHealthCheckResult } from '../../src/health/health.interfaces';
import { ApiClient } from './api-client';

describe('Health check', () => {
  let response: rp.FullResponse;
  let responseBody: GetHealthCheckResult;

  before(async () => {
    const client: ApiClient = new ApiClient();
    response = await client.getHealthCheck() as rp.FullResponse;
    responseBody = JSON.parse(response.body as string) as GetHealthCheckResult;
  });

  it('should return 200 OK', async () => {
    expect(response.statusCode).to.eql(HttpStatusCode.Ok);
  });

  it('should return success=true', async () => {
    expect(responseBody.success).to.eql(true);
  });

  it('should return CORS headers', () => {
    const corsHeaderValue: string = <string> response.headers['access-control-allow-origin'];
    expect(corsHeaderValue).to.eql('*');
  });
});
