import { APIGatewayEvent, Context, ProxyCallback, ProxyHandler, ProxyResult } from 'aws-lambda';  // tslint:disable-line no-implicit-dependencies (Using only the type information from the @types package.)
import { ErrorResult } from './errors';

// Type aliases to hide the 'aws-lambda' package and have consistent, short naming.
export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = ProxyHandler;
export type ApiResponse = ProxyResult;

export interface ErrorResponseBody {
  error: ErrorResult;
}
