import { ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';

export class CitiesController {
  public constructor(private _repo: CitiesRepository, private _env: NodeJS.ProcessEnv) {
  }

  public getCity(id: number): Promise<GetCityResult> {
    return new Promise((resolve: (result: GetCityResult) => void, reject: (reason: NotFoundResult) => void): void => {
      if (!this._repo.exists(id)) {
          reject(new NotFoundResult('UNKNOWN_CITY', 'There is no city with the specified ID!'));
          return;
      }

      if (!this._repo.hasAccess(id)) {
        reject(new ForbiddenResult('PERMISSION_REQUIRED', 'You have no permission to access the city with the specified ID!'));
        return;
      }

      const result: GetCityResult = {
        city: this._env.FAVORITE_CITY,
        id,
        randomNumber: Math.random()
      };

      resolve(result);
    });
  }
}
