import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as codeDeploy from '@aws-cdk/aws-codedeploy';


export class CdkLambdaDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Simple Lambda function that we will update and redeploy to test 
    // the ability to use Code Deploy managed canary deployments. 
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    // Define an Alias for the Lambda. 
    // This allows traffic to be shifted between Lambda versions
    const alias = new lambda.Alias(this, 'live', {
      aliasName: 'live',
      version: hello.currentVersion,
    });

    // API Gateway points to the Lambda Alias, not directly the to Function. 
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: alias
    });

    // Create the Code Deploy setup to manage the Canary deployment. 
    const lambdaApp = new codeDeploy.LambdaApplication(this, 'HelloApplicaiton');
    new codeDeploy.LambdaDeploymentGroup(this, 'HelloDeploymentGroup', {
      alias: alias,
      application: lambdaApp,
      deploymentConfig: codeDeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      deploymentGroupName: 'HelloLambdaDeploy'
    });

  }
}
