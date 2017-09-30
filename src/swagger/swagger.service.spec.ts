import { AWSError } from 'aws-sdk';
import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorCode } from '../../shared/error-codes';
import { ConfigurationErrorResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from '../../shared/errors';
import { GetSwaggerResult } from './swagger.interfaces';
import { SwaggerRepository } from './swagger.repository';
import { SwaggerService } from './swagger.service';

// tslint:disable no-unsafe-any (Generates false alarm for ts-mockito functions.)
// tslint:disable no-unused-expression (Generates false alarms for mocha "undefined" function.)

const chance: Chance.Chance = new Chance();

describe('SwaggerService', () => {
  const swaggerRepositoryMock: SwaggerRepository = mock(SwaggerRepository);
  const swaggerRepositoryMockInstance: SwaggerRepository = instance(swaggerRepositoryMock);
  let service: SwaggerService;
  interface TestData {
    restApiId: string;
    restApiName: string;
    stageName: string;
    swaggerDoc: GetSwaggerResult;
  }
  let testData: TestData;
  let testSwaggerDocJson: string;

  beforeEach(() => {
    reset(swaggerRepositoryMock);
    service = new SwaggerService(swaggerRepositoryMockInstance, process.env);
    testData = {
      restApiId: chance.word(),
      restApiName: chance.word(),
      stageName: chance.word(),
      swaggerDoc: {
        info: {
          title: chance.sentence(),
          version: chance.word(),
        },
        paths: {
          '/cities': {
            get: {},
            options: {},
            post: {}
          },
          '/continents': {
            get: {},
            options: {},
            post: {}
          },
          '/countries': {
            get: {}
          },
          '/swagger.json': {}
        }
      }
    };
    testSwaggerDocJson = JSON.stringify(testData.swaggerDoc);

    process.env.REST_API_NAME = testData.restApiName;
    process.env.STAGE_NAME = testData.stageName;
    process.env.API_INFO_TITLE = testData.swaggerDoc.info.title;
    process.env.API_INFO_VERSION = testData.swaggerDoc.info.version;
  });

  describe('getSwaggerDescription function', () => {
    it('should resolve with API info from the environment variables', async () => {
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.resolve(testData.restApiId));
      when(swaggerRepositoryMock.getSwaggerDescription(testData.restApiId, testData.stageName)).thenReturn(Promise.resolve(testSwaggerDocJson));

      const result: GetSwaggerResult = await service.getSwaggerDescription();
      expect(result.info.title).to.equal(testData.swaggerDoc.info.title);
      expect(result.info.version).to.equal(testData.swaggerDoc.info.version);
      expect(result.paths['/cities'].get).to.not.be.undefined;
      expect(result.paths['/cities'].post).to.not.be.undefined;
      expect(result.paths['/continents'].get).to.not.be.undefined;
      expect(result.paths['/continents'].post).to.not.be.undefined;
      expect(result.paths['/countries'].get).to.not.be.undefined;
    });

    it('should resolve without the swagger.json endpoint', async () => {
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.resolve(testData.restApiId));
      when(swaggerRepositoryMock.getSwaggerDescription(testData.restApiId, testData.stageName)).thenReturn(Promise.resolve(testSwaggerDocJson));

      const result: GetSwaggerResult = await service.getSwaggerDescription();
      expect(result.paths['/swagger.json']).to.be.undefined;
    });

    it('should resolve without the OPTIONS endpoints', async () => {
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.resolve(testData.restApiId));
      when(swaggerRepositoryMock.getSwaggerDescription(testData.restApiId, testData.stageName)).thenReturn(Promise.resolve(testSwaggerDocJson));

      const result: GetSwaggerResult = await service.getSwaggerDescription();
      expect(result.paths['/cities'].options).to.be.undefined;
      expect(result.paths['/countries'].options).to.be.undefined;
    });

    it('should reject without the REST_API_NAME in the environment', () => {
      process.env.REST_API_NAME = '';

      service.getSwaggerDescription()
        .catch((error: ErrorResult) => {
          expect(error).instanceof(ConfigurationErrorResult);
          expect(error.code).to.equal(ErrorCode.MissingEnv);
          expect(error.description).to.include('REST_API_NAME');
        });
    });

    it('should reject without the STAGE_NAME in the environment', () => {
      process.env.STAGE_NAME = '';

      service.getSwaggerDescription()
        .catch((error: ErrorResult) => {
          expect(error).instanceof(ConfigurationErrorResult);
          expect(error.code).to.equal(ErrorCode.MissingEnv);
          expect(error.description).to.include('STAGE_NAME');
        });
    });

    it('should reject without the API_INFO_TITLE in the environment', () => {
      process.env.API_INFO_TITLE = '';

      service.getSwaggerDescription()
        .catch((error: ErrorResult) => {
          expect(error).instanceof(ConfigurationErrorResult);
          expect(error.code).to.equal(ErrorCode.MissingEnv);
          expect(error.description).to.include('API_INFO_TITLE');
        });
    });

    it('should reject without the API_INFO_VERSION in the environment', () => {
      process.env.API_INFO_VERSION = '';

      service.getSwaggerDescription()
        .catch((error: ErrorResult) => {
          expect(error).instanceof(ConfigurationErrorResult);
          expect(error.code).to.equal(ErrorCode.MissingEnv);
          expect(error.description).to.include('API_INFO_VERSION');
        });
    });

    it('should reject for non-existing API', () => {
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.resolve(''));

      service.getSwaggerDescription()
        .catch((error: ErrorResult) => {
          expect(error).instanceof(NotFoundResult);
          expect(error.code).to.equal(ErrorCode.InvalidName);
        });
    });

    it('should reject for insufficient permissions', () => {
      const awsError: AWSError = <AWSError> new Error();
      awsError.code = 'AccessDeniedException';
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.reject(awsError));

      service.getSwaggerDescription()
        .catch((error: ErrorResult) => {
          expect(error).instanceof(ForbiddenResult);
          expect(error.code).to.equal(ErrorCode.MissingPermission);
        });
    });

    it('should reject if the getRestApiId repository call fails', () => {
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.reject(new Error()));

      service.getSwaggerDescription()
        .catch((error: Error) => {
          expect(error).instanceof(InternalServerErrorResult);
        });
    });

    it('should reject if the getSwaggerDescription repository call fails', () => {
      when(swaggerRepositoryMock.getRestApiId(testData.stageName, testData.restApiName)).thenReturn(Promise.resolve(testData.restApiId));
      when(swaggerRepositoryMock.getSwaggerDescription(testData.restApiId, testData.stageName)).thenReturn(Promise.reject(new Error()));

      service.getSwaggerDescription()
        .catch((error: Error) => {
          expect(error).instanceof(InternalServerErrorResult);
        });
    });
  });
});
