export class CitiesRepository {
  // tslint:disable-next-line prefer-function-over-method (Demo implementation.)
  public exists(id: number): boolean {
    return id > 0;
  }

  // tslint:disable-next-line prefer-function-over-method (Demo implementation.)
  public hasAccess(id: number): boolean {
    return id !== 666;   // tslint:disable-line no-magic-numbers (Demo number.)
  }
}
