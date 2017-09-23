import { APIGateway } from 'aws-sdk';

import { ApiHandler } from '../../shared/api.interfaces';
import { SwaggerController } from './swagger.controller';
import { SwaggerRepository } from './swagger.repository';
import { SwaggerService } from './swagger.service';

// This workaround is required becase Serverless Offline does not set environment variables properly.
// See: https://github.com/dherault/serverless-offline/issues/189
const defaultRegion: string = <string> (process.env.REGION_NAME || process.env.AWS_REGION);
const apiGateway: APIGateway = new APIGateway({ region: defaultRegion });

const repo: SwaggerRepository = new SwaggerRepository(apiGateway);
const service: SwaggerService = new SwaggerService(repo, process.env);
const controller: SwaggerController = new SwaggerController(service);

export const getSwaggerJson: ApiHandler = controller.getSwaggerJson;
