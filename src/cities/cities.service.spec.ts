import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { City, GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

describe('CitiesService', () => {
  const citiesRepositoryMock: CitiesRepository = mock(CitiesRepository);
  const citiesRepositoryMockInstance: CitiesRepository = instance(citiesRepositoryMock);
  let service: CitiesService;
  let testCity: City;

  beforeEach(() => {
    reset(citiesRepositoryMock);
    service = new CitiesService(citiesRepositoryMockInstance, process.env);
    testCity = {
      country: chance.country(),
      id: chance.natural(),
      name: chance.city(),
      populationDensity: chance.natural()
    };
  });

  describe('getCity function', () => {
    it('should resolve with the input id', async () => {
      process.env.DEFAULT_COUNTRY = testCity.country;
      when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.getCity(testCity.id, testCity.country)).thenReturn(testCity);

      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.id).to.equal(testCity.id);
    });

    it('should resolve with the default country from the environment variable', async () => {
      process.env.DEFAULT_COUNTRY = testCity.country;
      when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.getCity(testCity.id, testCity.country)).thenReturn(testCity);

      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.country).to.equal(testCity.country);
    });

    it('should resolve with the hard coded default country', async () => {
      const hungarianTestCity: City = testCity;
      hungarianTestCity.country = 'Hungary';

      process.env.DEFAULT_COUNTRY = '';

      when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.getCity(testCity.id, testCity.country)).thenReturn(hungarianTestCity);

      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.country).to.equal(hungarianTestCity.country);
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

    it('should reject if the repository call fails', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenThrow(new Error());

      service.getCity(id)
        .catch((error: Error) => {
          expect(error instanceof Error).to.equal(true);
        });
    });
  });
});
