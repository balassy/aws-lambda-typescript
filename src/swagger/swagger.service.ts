import { AWSError } from 'aws-sdk';
import { ErrorCode } from '../../shared/error-codes';
import { ConfigurationErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from '../../shared/errors';
import { SwaggerDoc } from './swagger.interfaces';
import { SwaggerRepository } from './swagger.repository';

export class SwaggerService {
  public constructor(private _repo: SwaggerRepository, private _env: NodeJS.ProcessEnv) {
  }

  public getSwaggerDescription(): Promise<SwaggerDoc> {
    if (!this._env.REST_API_NAME) {
      return Promise.reject(new ConfigurationErrorResult(ErrorCode.MissingEnv, 'The REST_API_NAME environment variable is missing!'));
    }

    if (!this._env.STAGE_NAME) {
      return Promise.reject(new ConfigurationErrorResult(ErrorCode.MissingEnv, 'The STAGE_NAME environment variable is missing!'));
    }

    if (!this._env.API_INFO_TITLE) {
      return Promise.reject(new ConfigurationErrorResult(ErrorCode.MissingEnv, 'The API_INFO_TITLE environment variable is missing!'));
    }

    if (!this._env.API_INFO_VERSION) {
      return Promise.reject(new ConfigurationErrorResult(ErrorCode.MissingEnv, 'The API_INFO_VERSION environment variable is missing!'));
    }

    const restApiName: string = <string> this._env.REST_API_NAME;
    const stageName: string = <string> this._env.STAGE_NAME;
    const title: string = <string> this._env.API_INFO_TITLE;
    const version: string = <string> this._env.API_INFO_VERSION;

    return this._repo.getRestApiId(stageName, restApiName)
      .then((restApiId: string) => {
        if (!restApiId) {
          throw new NotFoundResult(ErrorCode.InvalidName, 'Cannot find the API with the specified name!');
        }

        return this._repo.getSwaggerDescription(restApiId, stageName);
      })
      .then((jsonDesc: string) => {
        const doc: SwaggerDoc = <SwaggerDoc> JSON.parse(jsonDesc);

        // Remove the /swagger.json path from the documentation.
        delete doc.paths['/swagger.json'];

        // Remove the OPTIONS endpoints generated automatically because CORS is enabled.
        for (const pathName in doc.paths) {
          if (doc.paths[pathName].options) {
              delete doc.paths[pathName].options;
          }
        }

        // Update the 'info' properties in the header, because the API Gateway exports raw values instead of what is specified in the documentation.
        // This is a known issue with 'serverless-aws-documentation', read more in its README.
        doc.info.title = title;
        doc.info.version = version;

        return doc;
      })
      .catch((error: AWSError | NotFoundResult) => {
        if (error.code === 'AccessDeniedException') {
          throw new ForbiddenResult(ErrorCode.MissingPermission, error.message);
        }

        if (error instanceof NotFoundResult) {
          throw error;
        }

        throw new InternalServerErrorResult(error.name, error.message);
      });
  }
}
