import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorCode } from '../../shared/error-codes';
import { BadRequestResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from '../../shared/errors';
import { HttpStatusCode } from '../../shared/http-status-codes';
import { callFailure, callSuccess } from '../../test';
import { ApiErrorResponseParsed, ApiResponseParsed, PathParameter } from '../../test/test.interfaces';
import { CitiesController } from './cities.controller';
import { City, GetCityResult } from './cities.interfaces';
import { CitiesService } from './cities.service';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

describe('CitiesController', () => {
  const citiesServiceMock: CitiesService = mock(CitiesService);
  let controller: CitiesController;

  interface TestData {
    city: City;
    error: {
      code: string;
      description: string;
    };
  }
  let testData: TestData;

  beforeEach(() => {
    reset(citiesServiceMock);
    const citiesServiceMockInstance: CitiesService = instance(citiesServiceMock);
    controller = new CitiesController(citiesServiceMockInstance);
    testData = {
      city: {
        country: chance.country(),
        id: chance.natural(),
        name: chance.city(),
        populationDensity: chance.natural()
      },
      error: {
        code: chance.word(),
        description: chance.sentence()
      }
    };
  });

  describe('getCity function', () => {
    describe('success', () => {
      it('should return HTTP 200 OK', async () => {
        when(citiesServiceMock.getCity(testData.city.id)).thenReturn(Promise.resolve<GetCityResult>(testData));
        const pathParameters: PathParameter = {
          id: '' + testData.city.id
        };
        const response: ApiResponseParsed<GetCityResult> = await callSuccess<GetCityResult>(controller.getCity, pathParameters);
        expect(response.statusCode).to.equal(HttpStatusCode.Ok);
      });

      it('should return the city properties from the service', async () => {
        when(citiesServiceMock.getCity(testData.city.id)).thenReturn(Promise.resolve<GetCityResult>(testData));
        const pathParameters: PathParameter = {
          id: '' + testData.city.id
        };
        const response: ApiResponseParsed<GetCityResult> = await callSuccess<GetCityResult>(controller.getCity, pathParameters);
        expect(response.parsedBody.city.id).to.equal(testData.city.id);
        expect(response.parsedBody.city.name).to.equal(testData.city.name);
        expect(response.parsedBody.city.populationDensity).to.equal(testData.city.populationDensity);
      });
    });

    describe('service failures', () => {
      it('should return Forbidden for a city without permission', async () => {
        const errorResult: ForbiddenResult = new ForbiddenResult(testData.error.code, testData.error.description);
        when(citiesServiceMock.getCity(testData.city.id)).thenReturn(Promise.reject(errorResult));
        await callAndCheckError('' + testData.city.id, HttpStatusCode.Forbidden, errorResult);
      });

      it('should return Not Found for a non-existing city', async () => {
        const errorResult: NotFoundResult = new NotFoundResult(testData.error.code, testData.error.description);
        when(citiesServiceMock.getCity(testData.city.id)).thenReturn(Promise.reject(errorResult));
        await callAndCheckError('' + testData.city.id, HttpStatusCode.NotFound, errorResult);
      });

      it('should return Internal Server Error for a service failure', async () => {
        const errorResult: InternalServerErrorResult = new InternalServerErrorResult(ErrorCode.GeneralError, 'Sorry...');
        when(citiesServiceMock.getCity(testData.city.id)).thenReturn(Promise.reject(new Error()));
        await callAndCheckError('' + testData.city.id, HttpStatusCode.InternalServerError, errorResult);
      });
    });

    describe('local failures', () => {
      it('should return Bad Request for a missing city ID', async () => {
        const errorResult: BadRequestResult = new BadRequestResult(ErrorCode.MissingId, 'Please specify the city ID!');
        await callAndCheckError('', HttpStatusCode.BadRequest, errorResult);
      });

      it('should return Bad Request for a non-numberic city ID', async () => {
        const errorResult: BadRequestResult = new BadRequestResult(ErrorCode.InvalidId, 'The city ID must be a number!');
        await callAndCheckError(chance.word(), HttpStatusCode.BadRequest, errorResult);
      });
    });

    async function callAndCheckError(id: string, expectedHttpStatusCode: number, errorResult: ErrorResult): Promise<void> {
      const pathParameters: PathParameter = {
        id
      };
      const response: ApiErrorResponseParsed = await callFailure(controller.getCity, pathParameters);
      expect(response.statusCode).to.equal(expectedHttpStatusCode);

      expect(response.parsedBody.error.code).to.equal(errorResult.code);
      expect(response.parsedBody.error.description).to.equal(errorResult.description);
    }
  });
});
