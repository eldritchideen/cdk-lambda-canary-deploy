#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkLambdaDeployStack } from '../lib/cdk-lambda-deploy-stack';

const app = new cdk.App();
new CdkLambdaDeployStack(app, 'CdkLambdaDeployStack');
