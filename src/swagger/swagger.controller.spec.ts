import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorCode } from '../../shared/error-codes';
import { ConfigurationErrorResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from '../../shared/errors';
import { HttpStatusCode } from '../../shared/http-status-codes';
import { callFailure, callSuccess } from '../../test';
import { ApiErrorResponseParsed, ApiResponseParsed } from '../../test/test.interfaces';
import { SwaggerController } from './swagger.controller';
import { GetSwaggerResult } from './swagger.interfaces';
import { SwaggerService } from './swagger.service';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

describe('SwaggerController', () => {
  const swaggerServiceMock: SwaggerService = mock(SwaggerService);
  let controller: SwaggerController;

  interface TestData {
    error: {
      code: string;
      description: string;
    };
    swaggerDoc: GetSwaggerResult;
  }
  let testData: TestData;

  beforeEach(() => {
    reset(swaggerServiceMock);
    const citiesServiceMockInstance: SwaggerService = instance(swaggerServiceMock);
    controller = new SwaggerController(citiesServiceMockInstance);
    testData = {
      error: {
        code: chance.word(),
        description: chance.sentence()
      },
      swaggerDoc: {
        info: {
          title: chance.sentence(),
          version: chance.word(),
        },
        paths: {
        }
      }
    };
  });

  describe('getSwaggerJson function', () => {
    describe('success', () => {
      it('should return HTTP 200 OK', async () => {
        when(swaggerServiceMock.getSwaggerDescription()).thenReturn(Promise.resolve<GetSwaggerResult>(testData.swaggerDoc));
        const response: ApiResponseParsed<GetSwaggerResult> = await callSuccess<GetSwaggerResult>(controller.getSwaggerJson);
        expect(response.statusCode).to.equal(HttpStatusCode.Ok);
      });

      it('should return the info properties from the service', async () => {
        when(swaggerServiceMock.getSwaggerDescription()).thenReturn(Promise.resolve<GetSwaggerResult>(testData.swaggerDoc));
        const response: ApiResponseParsed<GetSwaggerResult> = await callSuccess<GetSwaggerResult>(controller.getSwaggerJson);
        expect(response.parsedBody.info.title).to.equal(testData.swaggerDoc.info.title);
        expect(response.parsedBody.info.version).to.equal(testData.swaggerDoc.info.version);
      });
    });

    describe('service failures', () => {
      it('should return Configuration Error for improper configuration', async () => {
        const errorResult: ConfigurationErrorResult = new ConfigurationErrorResult(ErrorCode.GeneralError, 'Sorry...');
        when(swaggerServiceMock.getSwaggerDescription()).thenReturn(Promise.reject(errorResult));
        await callAndCheckError(HttpStatusCode.ConfigurationError, errorResult);
      });

      it('should return Forbidden for insufficient permission', async () => {
        const errorResult: ForbiddenResult = new ForbiddenResult(testData.error.code, testData.error.description);
        when(swaggerServiceMock.getSwaggerDescription()).thenReturn(Promise.reject(errorResult));
        await callAndCheckError(HttpStatusCode.Forbidden, errorResult);
      });

      it('should return Not Found for a non-existing API', async () => {
        const errorResult: NotFoundResult = new NotFoundResult(testData.error.code, testData.error.description);
        when(swaggerServiceMock.getSwaggerDescription()).thenReturn(Promise.reject(errorResult));
        await callAndCheckError(HttpStatusCode.NotFound, errorResult);
      });

      it('should return Internal Server Error for a service failure', async () => {
        const errorResult: InternalServerErrorResult = new InternalServerErrorResult(ErrorCode.GeneralError, 'Sorry...');
        when(swaggerServiceMock.getSwaggerDescription()).thenReturn(Promise.reject(new Error()));
        await callAndCheckError(HttpStatusCode.InternalServerError, errorResult);
      });
    });

    async function callAndCheckError(expectedHttpStatusCode: number, errorResult: ErrorResult): Promise<void> {
      const response: ApiErrorResponseParsed = await callFailure(controller.getSwaggerJson);
      expect(response.statusCode).to.equal(expectedHttpStatusCode);

      expect(response.parsedBody.error.code).to.equal(errorResult.code);
      expect(response.parsedBody.error.description).to.equal(errorResult.description);
    }

  });
});
