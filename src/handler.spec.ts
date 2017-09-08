import { expect } from 'chai';
import { Chance } from 'chance';

import { HttpStatusCode } from '../shared/http-status-codes';
import { call, ProxyResultParsed } from '../test';
import { hello, HelloResult } from './handler';

const chance: Chance.Chance = new Chance();

describe('Hello function', () => {
  it('should return HTTP 200 OK', async () => {
    const result: ProxyResultParsed<HelloResult> = await call<HelloResult>(hello);
    expect(result.statusCode).to.equal(HttpStatusCode.Ok);
  });

  it('should return the city from the environment variable', async () => {
    const city: string = chance.city();
    process.env.FAVORITE_CITY = city;
    const result: ProxyResultParsed<HelloResult> = await call<HelloResult>(hello);
    expect(result.parsedBody.city).to.equal(city);
  });
});
