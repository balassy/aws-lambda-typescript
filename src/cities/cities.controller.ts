import { ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { GetCityResult } from './cities.interfaces';

export class CitiesController {
  public constructor(private _env: NodeJS.ProcessEnv) {
  }

  public getCity(id: number): Promise<GetCityResult> {
    return new Promise((resolve: (result: GetCityResult) => void, reject: (reason: NotFoundResult) => void): void => {
      if (id < 0) {
          reject(new NotFoundResult('UNKNOWN_CITY', 'There is no city with the specified ID!'));
          return;
      }

      // tslint:disable-next-line no-magic-numbers (Demo number.)
      if (id === 666) {
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
