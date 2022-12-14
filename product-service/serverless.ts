import type { AWS } from '@serverless/typescript';

import { getProductsListDynamoDB, getProductByIdDynamoDB, creteProductDynamoDB } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // SQS_ARN: 'SQSQueue',
      // SNS_ARN: 'SNSTopic'
    },
    // iamRoleStatements: [
    //   {
    //     Effect: "Allow",
    //     Action: ["sqs:*"],
    //     // Resource: "arn:aws:sqs:eu-west-1:827936631780:catalogItemsQueue"
    //     Resource: [{ 'Fn::GetAtt': ['SQSQueue', 'Arn'] }]
    //   },
    //   {
    //     Effect: "Allow",
    //     Action: ["sns:*"],
    //     Resource: {
    //       Ref: "SNSTopic"
    //     }
    //   }
    // ],
    httpApi: {
      cors: true
    }
  },
  // resources: {
  //   Resources: {
  //     SQSQueue: {
  //       Type: "AWS::SQS::Queue",
  //       Properties: {
  //         QueueName: "catalogItemsQueue"
  //       }
  //     },
  //     SNSTopic: {
  //       Type: "AWS::SNS::Topic",
  //       Properties: {
  //         TopicName: "createProductTopic"
  //       }
  //     },
  //     SNSSubscription: {
  //       Type: "AWS::SNS::Subscription",
  //       Properties: {
  //         Endpoint: "",
  //         Protocol: "email",
  //         TopicArn: {
  //           Ref: "SNSTopic"
  //         }
  //       }
  //     },
  //   }
  // },

  // import the function via paths
  functions: { getProductsListDynamoDB, getProductByIdDynamoDB, creteProductDynamoDB },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
