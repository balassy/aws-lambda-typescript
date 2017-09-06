import { APIGatewayEvent, Context, ProxyCallback, ProxyHandler, ProxyResult } from 'aws-lambda';

const HTTP_OK: number = 200;

const hello: ProxyHandler = (event: APIGatewayEvent, context: Context, callback: ProxyCallback): void => {
  const response: ProxyResult = {
    body: JSON.stringify({
      message: Math.random()
    }),
    statusCode: HTTP_OK
  };

  callback(undefined, response);
};

export { hello };
