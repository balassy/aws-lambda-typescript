import { APIGateway, AWSError } from 'aws-sdk';
import { expect } from 'chai';
import { Chance } from 'chance';

import { SwaggerRepository } from './swagger.repository';

// tslint:disable no-unused-expression (Generates false alarms for mocha "undefined" function.)

const chance: Chance.Chance = new Chance();

describe('SwaggerRepository', () => {
  let repo: SwaggerRepository;
  let testData: {
    restApiId: string;
    restApiName: string;
    stageName: string;
  };

  beforeEach(() => {
    testData = {
      restApiId: chance.word(),
      restApiName: chance.word(),
      stageName: chance.word()
    };
  });

  describe('getRestApiId function', () => {
    it('should resolve with the ID of the API with the matching name', async () => {
      const restApis: APIGateway.RestApi[] = [
        { id: undefined, name: testData.stageName },
        { id: undefined, name: testData.restApiName },
        { id: chance.word(), name: testData.stageName },
        { id: chance.word(), name: testData.restApiName },
        { id: testData.restApiId, name: `${testData.stageName}-${testData.restApiName}` },
        { id: chance.word(), name: `${testData.stageName}-${testData.restApiName}` }
      ];
      createRepo(restApis);

      const id: string = <string> await repo.getRestApiId(testData.stageName, testData.restApiName);
      expect(id).to.equal(testData.restApiId);
    });

    it('should resolve with undefined ID, if the API cannot be found', async () => {
      const restApis: APIGateway.RestApi[] = [
        { id: undefined, name: testData.stageName },
        { id: undefined, name: testData.restApiName },
        { id: chance.word(), name: testData.stageName },
        { id: chance.word(), name: testData.restApiName }
      ];
      createRepo(restApis);

      const id: string = <string> await repo.getRestApiId(testData.stageName, testData.restApiName);
      expect(id).to.be.undefined;
    });

    it('should resolve with undefined ID, if the there are no API created', async () => {
      const restApis: APIGateway.RestApi[] = [];
      createRepo(restApis);

      const id: undefined = <undefined> await repo.getRestApiId(testData.stageName, testData.restApiName);
      expect(id).to.be.undefined;
    });

    it('should reject with the original AWS error', async () => {
      const errorMessage: string = chance.sentence();
      const error: AWSError = <AWSError> new Error(errorMessage);
      const restApis: APIGateway.RestApi[] = [];
      createRepo(restApis, error);

      await repo.getRestApiId(testData.stageName, testData.restApiName)
        .catch((err: AWSError) => {
          expect(err.message).to.equal(errorMessage);
        });
    });
  });

  function createRepo(restApis: APIGateway.RestApi[], error?: AWSError): void {
    // NOTE: Manual mocking is used here, because mocking of the types in the AWS SDK is tricky,
    //       due to the fact that the SDK builds those objects dynamically based on a JSON definition.
    const apiGatewayMock: APIGateway = <APIGateway> {
      getRestApis: (callback: (error?: AWSError, data?: APIGateway.Types.RestApis) => void): void => {
        const data: APIGateway.RestApis = {
          items: restApis
        };
        callback(error, data);
      }
    };
    repo = new SwaggerRepository(apiGatewayMock);
  }
});
