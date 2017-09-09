import { APIGatewayEvent, Context, ProxyCallback, ProxyHandler, ProxyResult } from 'aws-lambda';

// Type aliases to hide the 'aws-lambda' package and have consistent, short naming.
export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiHandler = ProxyHandler;
export type ApiResponse = ProxyResult;

export interface ErrorResult {
  code: string;
  message: string;
}
