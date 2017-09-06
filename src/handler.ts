import { Callback, Context, Handler } from 'aws-lambda';

const HTTP_OK: number = 200;

interface HelloResponse {
  body: string;
  statusCode: number;
}

const hello: Handler = (event: {}, context: Context, callback: Callback): void => {
  const response: HelloResponse = {
    body: JSON.stringify({
      message: Math.floor(Math.random())
    }),
    statusCode: HTTP_OK
  };

  callback(undefined, response);
};

export { hello };
