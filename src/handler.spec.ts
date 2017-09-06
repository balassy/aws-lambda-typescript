import { ProxyResult } from 'aws-lambda';
import { expect } from 'chai';

import { call, HTTP_OK } from '../test';
import { hello } from './handler';

describe('Hello function', () => {
  it('should return HTTP 200 OK', async () => {
    const result: ProxyResult = await call(hello);
    expect(result.statusCode).to.equal(HTTP_OK);
  });
});
