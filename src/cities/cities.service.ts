import { ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { City, GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';

export class CitiesService {
  public constructor(private readonly _repo: CitiesRepository, private readonly _env: NodeJS.ProcessEnv) {
  }

  public async getCity(id: number): Promise<GetCityResult> {
      if (!this._repo.exists(id)) {
          throw new NotFoundResult('UNKNOWN_CITY', 'There is no city with the specified ID!');
      }

      if (!this._repo.hasAccess(id)) {
        throw new ForbiddenResult('PERMISSION_REQUIRED', 'You have no permission to access the city with the specified ID!');
      }

      const defaultCountry: string = this._env.DEFAULT_COUNTRY || 'Hungary';
      const city: City = this._repo.getCity(id, defaultCountry);
      const result: GetCityResult = {
        city
      };

      return result;
  }
}
