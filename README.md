# AWS Lambda in TypeScript

This sample uses the [Serverless Application Framework](https://serverless.com/) to implement an AWS Lambda function in TypeScript, deploy it via CloudFormation, and publish it through API Gateway.

> **IMPORTANT!** Since I am not working on any AWS Lambda project at the moment I temporarily suspended the maintenance of this project, because I cannot closely follow the evolution of the platform and validate that this project is still working and useful. I recently turned off Greenkeeper, because it often submitted broken PRs that failed on CI, and checking and fixing those took more time than I can spend on this project. I still believe that this sample has value and I am planning to update it for my next Lambda project. Thanks for understanding.

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Linux Build Status](https://travis-ci.org/balassy/aws-lambda-typescript.svg?branch=master)](https://travis-ci.org/balassy/aws-lambda-typescript)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/cuo6yvampkiids7i/branch/master?svg=true)](https://ci.appveyor.com/project/balassy/aws-lambda-typescript/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/balassy/aws-lambda-typescript/badge.svg)](https://coveralls.io/github/balassy/aws-lambda-typescript)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/balassy/aws-lambda-typescript/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/balassy/aws-lambda-typescript.svg)](https://github.com/balassy/aws-lambda-typescript/issues)
[![Swagger Validator](https://img.shields.io/swagger/valid/2.0/https/serverless-sample.balassy.me/api/swagger.json.svg)](https://app.swaggerhub.com/apis/balassy/serverless-sample)

[![Known Vulnerabilities](https://snyk.io/test/github/balassy/aws-lambda-typescript/badge.svg?targetFile=package.json)](https://snyk.io/test/github/balassy/aws-lambda-typescript?targetFile=package.json)
[![Dependencies](https://david-dm.org/balassy/aws-lambda-typescript/status.svg)](https://david-dm.org/balassy/aws-lambda-typescript)
[![DevDependencies](https://david-dm.org/balassy/aws-lambda-typescript/dev-status.svg)](https://david-dm.org/balassy/aws-lambda-typescript#type=dev)
[![codebeat badge](https://codebeat.co/badges/cd3e0118-3d7f-4c0d-8d27-14d05df5a356)](https://codebeat.co/projects/github-com-balassy-aws-lambda-typescript-master)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/2154/badge)](https://bestpractices.coreinfrastructure.org/projects/2154)

## Features

- Full **[TypeScript](https://www.typescriptlang.org/)** codebase with **strict** type annotation - _get as many compile time errors as possible._
- **Deployment to AWS** from the command line with [Serverless](https://serverless.com/) - _just run an npm script._
- Publishing to your **custom [Route53](https://aws.amazon.com/route53/) domain name** - _for API URLs that live forever._
- **Automated builds and CI** with [Travis CI](https://travis-ci.org/balassy/aws-lambda-typescript) on Linux and [AppVeyor](https://ci.appveyor.com/project/balassy/aws-lambda-typescript) on Windows - _get early feedback for every change_.
- **Offline** execution - _call your endpoints without deploying them to AWS._
- Minimal IAM policy to follow the **principle of least privilege** - _because with great power comes great responsibility_.
- **Code analysis** with [TSLint](https://palantir.github.io/tslint/) and [Codebeat](https://codebeat.co/projects/github-com-balassy-aws-lambda-typescript-master) - _avoid dumb coding mistakes._
- **Unit testing** with [Mocha](https://mochajs.org/), mocking with [ts-mockito](https://github.com/NagRock/ts-mockito) - _be free to change your implementation._
- Test **coverage report** with [Istanbul](https://istanbul.js.org/) and [Coveralls](https://coveralls.io) - _so you know your weak spots._
- **Integration testing** after release - _to verify your deployment._
- Generated **[Swagger](https://swagger.io/) documentation** for the endpoints, which works well with [SwaggerHub](https://app.swaggerhub.com) - _the expected description of your API._
- Multiple layers in the code to **separate concerns** and independently test them - _avoid monolith and complexity._
- **Health check** endpoints - _to quickly test your service._
- **Dependency checks** with [David](https://david-dm.org/) and [Snyk](https://snyk.io) - _because the majority of your app is not your code._
- **[EditorConfig](http://editorconfig.org/)** settings - _for consistent coding styles between different editors._
- Sample CRUD implementation (in progress) - _to see it all in action_.
- Follows Linux Foundation Core Infrastructure Initiative **[Best Practices](https://bestpractices.coreinfrastructure.org/en)** - _for the open source community._

For updates, please check the [CHANGELOG](https://github.com/balassy/aws-lambda-typescript/blob/master/CHANGELOG.md).

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
service: serverless-sample
```

7. **Customize the name of your domain** by changing the following lines in the `serverless.yml` file:

```
custom:
  customDomain:
    domainName: serverless-sample.balassy.me
    certificateName: serverless-sample.balassy.me
```

**NOTE:** You must have the certificate created in [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) before executing this command. According to AWS to use an ACM certificate with API Gateway, you must [request or import the certificate](https://serverless.com/blog/serverless-api-gateway-domain/) in the US East (N. Virginia) region.

If you don't want to publish your API to a custom domain, remove the `serverless-domain-manager` from the `plugins` section, and the `customDomains` entry from the `custom` section of the `serverless.yml` file.

## What you can find in the code

### Example CRUD endpoints

This project shows example Lambda function implementations with the following layers (see the `src/cities` folder):

- **Handler**: The handler is the endpoint that is called by AWS when it executes your Lambda. See `cities.ts`.
- **Controller**: The controller is responsible for transforming any operation result to an HTTP response. See `cities.controller.ts`.
- **Service**: The service is responsible for implementing the business logic, and provide the operation result. See `cities.service.ts`.
- **Repository**: The repository is responsible for providing the data for the service. See `cities.repository.ts`.

All layers have unit tests with mocking the underlying layers.

Additional terms:

- **Response**: The HTTP output for an endpoint call. It includes the HTTP status code, the response headers and the response body. The controller is responsible for building the response, using the `ResponseBuilder` helper class.
- **Result**: The outcome of the service call. It can be a success result or an error result.

To understand the code, open `src/cities/cities.ts`, find the `getCity` function and follow the call chain.

### Swagger export

The `src/swagger` folder contains the `/swagger.json` endpoint which exports the documentation of the API in [Swagger](https://swagger.io/) format. Call the endpoint after deploying your API and paste the response JSON into the [Swagger Editor](https://editor.swagger.io) to display it in a friendly way.

You can also reference the `swagger.json` URL when you publish your documentation via [SwaggerHub](https://app.swaggerhub.com), as you can see on the SwaggerHub page of this sample: https://app.swaggerhub.com/apis/balassy/serverless-sample.

### Health check endpoints

The `/health/check` and the `/health/check/detailed` endpoints in the `src/health` folder are provided to run quick checks on your API after deployment.

## Developer tasks

Frequently used `npm script`s:

| Script name   | Description                                                                                                         |
|---------------|---------------------------------------------------------------------------------------------------------------------|
| `analyse`     | Runs all code analysis tools, including linters and unit tests.                                                     |
| `deploy`      | Runs all analysis tools, creates the deployment package, installs it on AWS and finally runs the integration tests. |
| `start`       | Runs the service locally, so you can call your API endpoints on http://localhost.                                   |

Additional useful `npm script`s:

| Script name        | Description                                                                                                                     |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `build`            | Runs all pre-deploy analysis and creates the deployment package, but does not install it onto AWS.                              |
| `clean`            | Removes all tool-generated files and folders (build output, coverage report etc.). Automatically runs as part of other scripts. |
| `deploy:init`      | Creates the domain in Route53. Required to manually execute once.                                                               |
| `lint`             | Runs the static code analyzers. Automatically runs before deployment.                                                           |
| `test`             | Runs the unit tests. Automatically runs before deployment.                                                                      |
| `test:integration` | Runs the integration tests. Automatically runs after deployment.                                                                |

### Test the service locally

**To invoke the Lambda function locally, run:** _This command requires Administrator privileges on Windows!_

```
serverless invoke local --function getCity
```

**To run the service locally, run:** _This command requires Administrator privileges on Windows!_

```bash
npm start
```

This command will not terminate, but will keep running a webserver that you can use to locally test your service. Verify that the service runs perfectly by opening the `http://localhost:3000` URL in your browser. The console window will log your requests.

You can modify your code after running this command, Serverless will automatically recognize the changes and recompile your code.

### Deploy to AWS

**To create a custom domain for your service in AWS, run this command once:** _This command requires Administrator privileges on Windows!_

```bash
npm run deploy:init
```

According to AWS, after this command it may take up to 40 minutes to initialize the domain with a CloudFront distribution. In practice it usually takes about 10 minutes.

**To deploy the service to AWS, run:** _This command requires Administrator privileges on Windows!_

```bash
serverless deploy
```

or you can use the NPM script alias, which is recommended, because it runs the analysers (linter + tests) before deployment, and integration tests after deployment:

```bash
npm run deploy
```

Verify that the deployment is completed successfully by opening the URL displayed in your console window in your browser. To see all resources created in AWS navigate to CloudFormation in the AWS Console and look for the stack named with the name of your service you specified in Step 6.

**To download the Swagger description** of your service, open the following URL in your browser:

```
https://<your_custom_domain_name>/api/swagger.json
```

Note that this endpoint always downloads the Swagger documentation from the live, published API, even if the code is running locally!

If you don't want to deploy your code, just want to peek into the deployment package, you can run:

```bash
npm run build
```

This command is not only an alias to `serverless package`, but also runs all analyzers that the deploy process also runs.

### Run linter

**To check your codebase with TSLint, run:**

```bash
npm run lint
```

The linter automatically checks your code before deployment, so you don't need to run it manually.

### Run unit tests

**To check your code with unit tests, run:**

```
npm test
```

The unit tests are automatically running before deployment, so you don't need to run them manually.

### Run integration tests

**To verify that your deployment completed successfully, run:**

```
npm run test:integration
```

The integration tests are automatically running after deployment, so you don't need to run them manually.

### View the documentation

To view the generated Swagger documentation, deploy your API or start it locally, and then call the `/swagger.json` endpoint.


## Problems?

```
EPERM: operation not permitted, symlink 'C:\Git\aws-lambda-typescript\node_modules' -> 'C:\Git\aws-lambda-typescript\.build\node_modules'
```

On Windows you need **Administrator privileges** to run `serverless` commands (see [Issue 23](https://github.com/graphcool/serverless-plugin-typescript/issues/23)).

## Got feedback?

Your feedback is more than welcome, please send your suggestions, feature requests or bug reports as [Github issues](https://github.com/balassy/aws-lambda-typescript/issues).

## Contributing guidelines

Contributions of all kinds are welcome, please feel free to send Pull Requests. As they are requirements of successful build all linters and tests MUST pass, and also please make sure you have a reasonable code coverage for new code.

Thanks for your help in making this project better!

## Read more

* [Serverless.yml Reference](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)

## Acknowledments

Thanks to Shovon Hasan for his article on [Deploying a TypeScript + Node AWS Lambda Function with Serverless](https://blog.shovonhasan.com/deploying-a-typescript-node-aws-lambda-function-with-serverless/).


## About the author

This project was created by [György Balássy](https://linkedin.com/in/balassy).
