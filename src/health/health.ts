import { ApiHandler } from '../../shared/api.interfaces';
import { HealthController } from './health.controller';

const controller: HealthController = new HealthController();

export const getHealthCheck: ApiHandler = controller.getHealthCheck;
export const getHealthCheckDetailed: ApiHandler = controller.getHealthCheckDetailed;
