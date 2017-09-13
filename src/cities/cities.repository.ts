export class CitiesRepository {
  /* istanbul ignore next Demo implementation. */
  // tslint:disable-next-line prefer-function-over-method (Demo implementation.)
  public exists(id: number): boolean {
    return id > 0;
  }

  /* istanbul ignore next Demo implementation. */
  // tslint:disable-next-line prefer-function-over-method (Demo implementation.)
  public hasAccess(id: number): boolean {
    return id !== 666;   // tslint:disable-line no-magic-numbers (Demo number.)
  }
}
