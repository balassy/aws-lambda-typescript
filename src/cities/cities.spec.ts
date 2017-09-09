import { expect } from 'chai';
import { Chance } from 'chance';

import { HttpStatusCode } from '../../shared/http-status-codes';
import { call } from '../../test';
import { ApiResponseParsed, PathParameter } from '../../test/test.interfaces';
import { getCity } from './cities';
import { GetCityResult } from './cities.interfaces';

const chance: Chance.Chance = new Chance();

describe('Cities', () => {
  describe('getCity function', () => {
    it('should return HTTP 200 OK', async () => {
      const result: ApiResponseParsed<GetCityResult> = await call<GetCityResult>(getCity);
      expect(result.statusCode).to.equal(HttpStatusCode.Ok);
    });

    it('should return the city from the environment variable', async () => {
      const city: string = chance.city();
      process.env.FAVORITE_CITY = city;
      const result: ApiResponseParsed<GetCityResult> = await call<GetCityResult>(getCity);
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
});
