import { AWSError } from 'aws-sdk';
import { ErrorCode } from '../../shared/error-codes';
import { ConfigurationErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from '../../shared/errors';
import { GetSwaggerResult } from './swagger.interfaces';
import { SwaggerRepository } from './swagger.repository';

export class SwaggerService {
  public constructor(private readonly _repo: SwaggerRepository, private readonly _env: NodeJS.ProcessEnv) {
  }

  public getSwaggerDescription(): Promise<GetSwaggerResult> {
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

    /* tslint:disable:no-unnecessary-type-assertion - False positive */
    const restApiName: string = <string> this._env.REST_API_NAME;
    const stageName: string = <string> this._env.STAGE_NAME;
    const title: string = <string> this._env.API_INFO_TITLE;
    const version: string = <string> this._env.API_INFO_VERSION;
    /* tslint:enable:no-unnecessary-type-assertion */

    return this._repo.getRestApiId(stageName, restApiName)
      .then((restApiId: string | undefined) => {
        if (!restApiId) {
          throw new NotFoundResult(ErrorCode.InvalidName, 'Cannot find the API with the specified name!');
        }

        return this._repo.getSwaggerDescription(restApiId, stageName);
      })
      .then((jsonDesc: string) => {
        const result: GetSwaggerResult = <GetSwaggerResult> JSON.parse(jsonDesc);

        // Remove the /swagger.json path from the documentation.
        delete result.paths['/swagger.json'];

        // Remove the OPTIONS endpoints generated automatically because CORS is enabled.
        for (const pathName in result.paths) {
          if (result.paths[pathName].options) {
              delete result.paths[pathName].options;
          }
        }

        // Update the 'info' properties in the header, because the API Gateway exports raw values instead of what is specified in the documentation.
        // This is a known issue with 'serverless-aws-documentation', read more in its README.
        result.info.title = title;
        result.info.version = version;

        return result;
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
