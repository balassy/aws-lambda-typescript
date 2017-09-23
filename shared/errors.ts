// tslint:disable max-classes-per-file (Many simple inherited classes.)

export abstract class ErrorResult extends Error {
  public constructor(public code: string, public description: string) {
    super(description);
  }
}

export class BadRequestResult extends ErrorResult {}

export class ConfigurationErrorResult extends ErrorResult {}

export class ForbiddenResult extends ErrorResult {}

export class InternalServerErrorResult extends ErrorResult {}

export class NotFoundResult extends ErrorResult {}

// tslint:enable
