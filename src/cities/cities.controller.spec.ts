import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { CitiesController } from './cities.controller';
import { GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

describe('CitiesController', () => {
  const citiesRepositoryMock: CitiesRepository = mock(CitiesRepository);
  const citiesRepositoryMockInstance: CitiesRepository = instance(citiesRepositoryMock);

  beforeEach(() => {
    reset(citiesRepositoryMock);
  });

  describe('getCity function', () => {
    it('should resolve with a result', async () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(true);

      const city: string = chance.city();
      process.env.FAVORITE_CITY = city;

      const controller: CitiesController = new CitiesController(citiesRepositoryMockInstance, process.env);
      const result: GetCityResult = await controller.getCity(id);
      expect(result.id).to.equal(id);
      expect(result.city).to.equal(city);
    });

    it('should reject for non-existing ID', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(false);

      const controller: CitiesController = new CitiesController(citiesRepositoryMockInstance, process.env);
      controller.getCity(id)
        .catch((error: ErrorResult) => {
          expect(error instanceof NotFoundResult).to.equal(true);
        });
    });

    it('should reject for ID without permission', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(false);

      const controller: CitiesController = new CitiesController(citiesRepositoryMockInstance, process.env);
      controller.getCity(id)
        .catch((error: ErrorResult) => {
          expect(error instanceof ForbiddenResult).to.equal(true);
        });
    });

    it('should reject if the repository call failes', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenThrow(new Error());

      const controller: CitiesController = new CitiesController(citiesRepositoryMockInstance, process.env);
      controller.getCity(id)
        .catch((error: Error) => {
          expect(error instanceof Error).to.equal(true);
        });
    });
  });
});
