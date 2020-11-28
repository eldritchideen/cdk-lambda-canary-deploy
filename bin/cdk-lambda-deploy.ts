#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkLambdaDeployStack } from '../lib/cdk-lambda-deploy-stack';
import { CdkPythonLambdaDeployStack } from '../lib/cdk-py-lambda-deploy';

const app = new cdk.App();
new CdkLambdaDeployStack(app, 'CdkLambdaDeployStack');
new CdkPythonLambdaDeployStack(app, 'CdkPythonLambdaDeployStack');
