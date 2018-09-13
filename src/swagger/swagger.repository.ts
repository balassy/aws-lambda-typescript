import { APIGateway, AWSError } from 'aws-sdk';

export class SwaggerRepository {
  public constructor(private readonly _apigw: APIGateway) {
  }

  public getRestApiId(stageName: string, apiName: string): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve: (result?: string) => void, reject: (reason: AWSError) => void): void => {
      this._apigw.getRestApis((error: AWSError, data: APIGateway.Types.RestApis): void => {
        if (error) {
          reject(error);
          return;
        }

        const targetApiName: string = `${stageName}-${apiName}`;

        if (data.items && data.items.length > 0) {
          const matchingApi: APIGateway.Types.RestApi | undefined = data.items.find((api: APIGateway.Types.RestApi) => api.name === targetApiName);
          resolve(matchingApi ? matchingApi.id : undefined);
        }

        resolve();
      });
    });
  }

  public getSwaggerDescription(restApiId: string, stageName: string): Promise<string> {
    return new Promise<string>((resolve: (result: string) => void, reject: (reason: AWSError) => void): void => {
      const params: APIGateway.Types.GetExportRequest = {
        accepts: 'application/json',
        exportType: 'swagger',
        restApiId,
        stageName
      };

      this._apigw.getExport(params, (error: AWSError, data: APIGateway.ExportResponse): void => {
        if (error) {
          reject(error);
          return;
        }

        resolve(<string> data.body);
      });
    });
  }
}
