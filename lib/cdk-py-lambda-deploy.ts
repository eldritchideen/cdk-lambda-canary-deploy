import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as codeDeploy from '@aws-cdk/aws-codedeploy';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';


export class CdkPythonLambdaDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Simple Python based Lambda function to test packaging with pip dependencies. 
    const ipLambda = new PythonFunction(this, 'IPLambda', {
        entry: 'lambda/py/',
        index: 'app.py',
        handler: 'lambda_handler',
        runtime: lambda.Runtime.PYTHON_3_8
    });

    // Define an Alias for the Lambda. 
    // This allows traffic to be shifted between Lambda versions
    const alias = new lambda.Alias(this, 'live', {
      aliasName: 'live',
      version: ipLambda.currentVersion,
    });

    // API Gateway points to the Lambda Alias, not directly the to Function. 
    // Use default settings to proxy everthing to the lambda. 
    new apigw.LambdaRestApi(this, 'IPLambdaEndpoint', {
      handler: alias
    });

    // Create the Code Deploy setup to manage the Canary deployment. 
    const lambdaApp = new codeDeploy.LambdaApplication(this, 'IPLambdaApplicaiton');
    new codeDeploy.LambdaDeploymentGroup(this, 'IPLambdaDeploymentGroup', {
      alias: alias,
      application: lambdaApp,
      deploymentConfig: codeDeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      deploymentGroupName: 'IPLambdaLambdaDeploy'
    });

  }
}
