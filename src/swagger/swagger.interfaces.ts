export interface GetSwaggerResult {
  info: {
    title: string;
    version: string;
  };
  paths: {
    [x: string]: {
      options?: {
        [x: string]: any;   // tslint:disable-line no-any (We don't have exact information about the structure of the Swagger document.)
      };
      [x: string]: any;     // tslint:disable-line no-any (We don't have exact information about the structure of the Swagger document.)
    };
  };
  [x: string]: any;         // tslint:disable-line no-any (We don't have exact information about the structure of the Swagger document.)
}
