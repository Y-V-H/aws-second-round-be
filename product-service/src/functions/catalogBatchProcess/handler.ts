// import { middyfy } from "@libs/lambda";
// import { headers } from '../../utils/headers';
// import { createParams } from '../../utils/create-params';
// import { addToDb } from '../../utils/add-to-db';
// const AWS = require('aws-sdk');
// const sns = new AWS.SNS({
//     region: 'eu-west-1'
// });
// const dynamodb = new AWS.DynamoDB({
//     apiVersion: '2012-08-10'
// });
// AWS.config.update({ region: 'eu-west-1' });

// const catalogBatchProcess = async (event) => {
//     // console.log('event!', event);
//     console.log(1111111111111111111111111111111111111111111111111111111111111111111111)

//     try {
//         const products = event.Records.map(({
//             body
//         }) => body);

//         for (const item of products) {
//             const product = JSON.parse(item);

//             const productParams = createParams(product);

//             await addToDb(dynamodb, productParams);

//             const params = {
//                 TopicArn: process.env.SNS_ARN,
//                 Subject: "Test SNS From Lambda",
//                 Message: `Created products: ${JSON.stringify(product)}`,
//             };

//             await sns.publish(params).promise();

//         }
//     } catch (error) {
//         console.error(error);

//         return {
//             statusCode: 500,
//             headers: headers,
//             body: error,
//         }
//     }
// };

// export const main = middyfy(catalogBatchProcess);