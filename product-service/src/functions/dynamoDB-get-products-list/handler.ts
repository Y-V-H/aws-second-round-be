import { middyfy } from "@libs/lambda";
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

const scanDynamoDBTable = (tableName: string): any => {
    return dynamo
        .scan({
            TableName: tableName
        })
        .promise();
};

const createResponse = async () => {
    const scanProducstResult = await scanDynamoDBTable('products');
    const products = scanProducstResult.Items;

    const scanStokResult = await scanDynamoDBTable('stocks');
    const stocks = scanStokResult.Items;

    if (!products.length) throw new Error("Problem with loading products");
    if (!stocks.length)
        throw new Error("Problem with loading count of products");

    const response = products.map((item) => {
        const count = stocks.filter((stock) => stock.id === item.id);

        return {
            id: item.id,
            description: item.description,
            price: item.price,
            title: item.title,
            image: item.image,
            count: count[0].count,
        };
    });

    return response;
};

export const getProductsListDynamoDB = async (event) => {
    console.log('Get products with argument', event);

    try {
        const data = await createResponse();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers,
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                error: `Failed to load products 123`,
            }),
            headers,
        };
    }
};

export const main = middyfy(getProductsListDynamoDB);
