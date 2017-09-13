import { expect } from 'chai';
import { Chance } from 'chance';

import { HttpStatusCode } from '../../shared/http-status-codes';
import { call } from '../../test';
import { ApiResponseParsed, PathParameter } from '../../test/test.interfaces';
import { getCity } from './cities';
import { GetCityResult } from './cities.interfaces';

const chance: Chance.Chance = new Chance();

describe('Cities handler', () => {
  describe('getCity function', () => {
    describe('success', () => {
      it('should return HTTP 200 OK', async () => {
        await callAndCheckStatusCode('1', HttpStatusCode.Ok);
      });

      it('should return the city from the environment variable', async () => {
        const city: string = chance.city();
        process.env.FAVORITE_CITY = city;
        const pathParameters: PathParameter = {
          id: '1'
        };
        const result: ApiResponseParsed<GetCityResult> = await call<GetCityResult>(getCity, pathParameters);
        expect(result.parsedBody.city).to.equal(city);
      });

      it('should return the ID from the URL', async () => {
        const id: number = chance.natural();
        const pathParameters: PathParameter = {
          id: '' + id
        };
        const result: ApiResponseParsed<GetCityResult> = await call<GetCityResult>(getCity, pathParameters);
        expect(result.parsedBody.id).to.equal(id);
      });
    });

    describe('failure', () => {
      it('should return Forbidden for a city without permission', async () => {
        await callAndCheckStatusCode('666', HttpStatusCode.Forbidden);
      });

      it('should return Not Found for a non-existing city', async () => {
        await callAndCheckStatusCode('-1', HttpStatusCode.NotFound);
      });

      it('should return Bad Request for a non-numberic city ID', async () => {
        await callAndCheckStatusCode(chance.word(), HttpStatusCode.BadRequest);
      });
    });

    async function callAndCheckStatusCode(id: string, expectedHttpStatusCode: number): Promise<void> {
      const pathParameters: PathParameter = {
        id
      };
      const result: ApiResponseParsed<GetCityResult> = await call<GetCityResult>(getCity, pathParameters);
      expect(result.statusCode).to.equal(expectedHttpStatusCode);
    }
  });
});
