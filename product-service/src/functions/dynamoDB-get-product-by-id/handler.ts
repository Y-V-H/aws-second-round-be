import { middyfy } from '@libs/lambda';
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const getItem = async (tableName, id) => {
    const result = await dynamo.get({
        TableName: tableName,
        Key: {
            id
        }
    })
        .promise();

    return result.Item;
}

export const getProductByIdDynamoDB = async (event) => {
    const { productId } = event.pathParameters;
    console.log('get product by ID with argument', productId);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    }

    try {
        const productItem = await getItem('products', productId);
        const stockItem = await getItem('stocks', productId);
        const data = {
            ...productItem,
            count: stockItem.count
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: headers
        }
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: `Failed to load product with ID ${productId}`
            }),
        }
    }
}

export const main = middyfy(getProductByIdDynamoDB);