
'use strict';

const { v4: uuidv4} = require('uuid');
const { headers } = require('../utils/headers');
const AWS = require('aws-sdk');
const sns = new AWS.SNS({
    region: 'eu-west-1'
});
const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});
AWS.config.update({ region: 'eu-west-1' });

module.exports.catalogBatchProcess = async (event) => {
    console.log('event', event);

    try {
        const products = event.Records.map(({
            body
        }) => body);

        for (const item of products) {
            const product = JSON.parse(item);

            const productParams = createParams(product);

            await addToDb(dynamodb, productParams);

            const params = {
                TopicArn: process.env.SNS_ARN,
                Subject: "Test SNS From Lambda",
                Message: `Created products: ${JSON.stringify(product)}`,
            };
            console.log(params, 'params for sns')
            const resultSNS = await sns.publish(params).promise();
            console.log(resultSNS, "resultSNS")
        }
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers,
            body: error,
        }
    }
}

const createParams = params => {
    const uId = uuidv4();

    return {
        RequestItems: {
            'products': [
                {
                    PutRequest: {
                        Item: {
                            id: { S: uId },
                            description: { S: params.description },
                            price: { N: params.price.toString() },
                            title: { S: params.title },
                            image: { S: params.image }
                        }
                    }
                }
            ],
            'stocks': [
                {
                    PutRequest: {
                        Item: {
                            id: { S: uId },
                            count: { S: params.count.toString() },
                        }
                    }
                }
            ],
        }
    };
};

const addToDb = async (dynamoDB, productParams) => {
    return new Promise(function (resolve, reject) {
        dynamoDB.batchWriteItem(productParams, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    })
}