import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

describe('CitiesService', () => {
  const citiesRepositoryMock: CitiesRepository = mock(CitiesRepository);
  const citiesRepositoryMockInstance: CitiesRepository = instance(citiesRepositoryMock);
  let service: CitiesService;

  beforeEach(() => {
    reset(citiesRepositoryMock);
    service = new CitiesService(citiesRepositoryMockInstance, process.env);
  });

  describe('getCity function', () => {
    it('should resolve with the input id', async () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(true);

      const result: GetCityResult = await service.getCity(id);
      expect(result.id).to.equal(id);
    });

    it('should resolve with the city from the environment variable', async () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(true);

      const city: string = chance.city();
      process.env.FAVORITE_CITY = city;

      const result: GetCityResult = await service.getCity(id);
      expect(result.city).to.equal(city);
    });

    it('should reject for non-existing ID', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(false);

      service.getCity(id)
        .catch((error: ErrorResult) => {
          expect(error instanceof NotFoundResult).to.equal(true);
        });
    });

    it('should reject for ID without permission', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(false);

      service.getCity(id)
        .catch((error: ErrorResult) => {
          expect(error instanceof ForbiddenResult).to.equal(true);
        });
    });

    it('should reject if the repository call failes', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenThrow(new Error());

      service.getCity(id)
        .catch((error: Error) => {
          expect(error instanceof Error).to.equal(true);
        });
    });
  });
});
