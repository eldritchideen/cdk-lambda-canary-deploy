import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as codeDeploy from '@aws-cdk/aws-codedeploy';
import { appendFile } from 'fs';


export class CdkLambdaDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    const alias = new lambda.Alias(this, 'live', {
      aliasName: 'live',
      version: hello.currentVersion,
    });

    const lambdaApp = new codeDeploy.LambdaApplication(this, 'HelloApplicaiton');
    new codeDeploy.LambdaDeploymentGroup(this, 'HelloDeploymentGroup', {
      alias: alias,
      application: lambdaApp,
      deploymentConfig: codeDeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      deploymentGroupName: 'HelloLambdaDeploy'
    });

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: alias
    });

  }
}
