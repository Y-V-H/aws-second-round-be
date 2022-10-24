import { middyfy } from "@libs/lambda";
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const successAdded = data => {
    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    }
}

const failedAdd = error => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            error
        }),
    }
}

export const creteProductDynamoDB = async (event) => {
    console.log('Crete element with parametars', event.body);
    const bodyData = event.body;

    try {
        var params = {
            RequestItems: {
                'products': [
                    {
                        PutRequest: {
                            Item: {
                                id: bodyData.id,
                                description: bodyData.description,
                                price: bodyData.price,
                                title: bodyData.title,
                                image: bodyData.image
                            }
                        }
                    }
                ],
                'stocks': [
                    {
                        PutRequest: {
                            Item: {
                                id: bodyData.id,
                                count: bodyData.count,
                            }
                        }
                    }
                ],
            }
        };

        await dynamo.batchWriteItem(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                failedAdd(err);
            } else {
                console.log(data);
                successAdded(data);
            }
        }).promise();
    } catch (error) {
        console.log(error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                error: `Please check all necessary parameters for request`
            }),
        }
    }
}

export const main = middyfy(creteProductDynamoDB);