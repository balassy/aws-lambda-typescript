import { ApiHandler } from '../../shared/api.interfaces';
import { CitiesController } from './cities.controller';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

const repo: CitiesRepository = new CitiesRepository();
const service: CitiesService = new CitiesService(repo, process.env);
const controller: CitiesController = new CitiesController(service);

export const getCity: ApiHandler = controller.getCity;
