import { ApiHandler } from '../../shared/api.interfaces';
import { CitiesController } from './cities.controller';
import { CitiesHandler } from './cities.handler';
import { CitiesRepository } from './cities.repository';

const repo: CitiesRepository = new CitiesRepository();
const controller: CitiesController = new CitiesController(repo, process.env);
const handler: CitiesHandler = new CitiesHandler(controller);

export const getCity: ApiHandler = handler.getCity;

