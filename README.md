# AWS Lambda in TypeScript

This sample uses the [Serverless Application Framework](https://serverless.com/) to implement an AWS Lambda function in TypeScript, deploy it via CloudFormation, and publish it through API Gateway.

## Setup

1. **Install [Node.js](https://nodejs.org).**

2. **Install the [Serverless Application Framework](https://serverless.com/) as a globally available package:**

```bash
npm install serverless -g
```

Verify that Serverless was installed correctly:

```
serverless -v
```

3. **Setup AWS credentials:**

  * Create a new IAM Policy in AWS using the `aws-setup/aws-policy.json` file. Note that the file contains placeholders for your `<account_no>`, `<region>`, `<service_name>`, and `<your_deployment_bucket>`.
  You can replace all those `Resource` ARNs with `*`, if you intentionally don't want to follow the Principle of Least Privilege, but want to avoid permission issues.
  (If you prefer minimal permissions, just like me, you may want to follow [Issue 1439: Narrowing the Serverless IAM Deployment Policy](https://github.com/serverless/serverless/issues/1439). )

  * Create a new IAM User for Programmatic Access only, assign the previously created policy to it, and get the Access Key ID and the Secret Access Key of the user.

  * Save the credentials to the `~/.aws/credentials` file:

  ```bash
  serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
  ```
  
  _Unfortunately on Windows you will need an Administrator user to run the Serverless CLI._

  You can read more about setting up AWS Credentials on the [AWS - Credentials page](https://serverless.com/framework/docs/providers/aws/guide/credentials/) of the Serverless Guide.

4. **Clone this repository.**

5. **Install the dependencies:**

```bash
npm install
```

6. **Customize the name of your service** by changing the following line in the `serverless.yml` file:

```
service: serverless-lambda-typescript-example
```

## Test the service locally

**To invoke the Lambda function locally, run:** _This command requires Administrator privileges on Windows!_

```
serverless invoke local --function hello
```

**To run the service locally, run:** _This command requires Administrator privileges on Windows!_

```bash
serverless offline start
```

or you can use the NPM script alias:

```bash
npm start
```

This command will not terminate, but will keep running a webserver that you can use to locally test your service. Verify that the service runs perfectly by opening the `http://localhost:3000/hello` URL in your browser. The console window will log your requests.

You can modify your code after running this command, Serverless will automatically recognize the changes and recompile your code.

## Deploy to AWS

**To deploy the service to AWS, run:** _This command requires Administrator privileges on Windows!_

```bash
serverless deploy
```

or you can use the NPM script alias, which is recommended, because it runs the analysers (linter + tests) before deployment:

```bash
npm run deploy
```

Verify that the deployment is completed successfully by opening the URL displayed in your console window in your browser. To see all resources created in AWS navigate to CloudFormation in the AWS Console and look for the stack named with the name of your service you specified in Step 6.

If you don't want to deploy your code, just want to peek into the deployment package, you can run:

```bash
npm run pack
```

This command is not only an alias to `serverless package`, but also runs all analyzers that the deploy process runs.

## Run linter

**To check your codebase with TSLint, run:**

```bash
npm run lint
```

The linter automatically checks your code before deployment, so you don't need to run it manually.

## Run unit tests

**To check your code with unit tests, run:**

```
npm test
```

The tests are automatically running before deployment, so you don't need to run them manually.


## Problems?

```
EPERM: operation not permitted, symlink 'C:\Git\lambda-typescript\node_modules' -> 'C:\Git\lambda-typescript\.build\node_modules'
```

On Windows you need **Administrator privileges** to run `serverless` commands (see [Issue 23](https://github.com/graphcool/serverless-plugin-typescript/issues/23)).

## Read more

* [Serverless.yml Reference](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)

## Acknowledments

Thanks to Shovon Hasan for his article on [Deploying a TypeScript + Node AWS Lambda Function with Serverless](https://blog.shovonhasan.com/deploying-a-typescript-node-aws-lambda-function-with-serverless/).


## About the author

This project is maintaned by [György Balássy](http://gyorgybalassy.wordpress.com).