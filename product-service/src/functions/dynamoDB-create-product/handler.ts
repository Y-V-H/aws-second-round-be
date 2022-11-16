import { middyfy } from "@libs/lambda";
import { addToDb } from '../../utils/add-to-db';
import { createParams } from '../../utils/create-params';
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

export const creteProductDynamoDB = async (event) => {
    const bodyData = event.body;
    // console.log('Crete element with parameters', bodyData);
    // console.log('uId', uId);
    // console.log('bodyData.price', typeof (bodyData.price));

    try {
        var params = createParams(bodyData);

        await addToDb(dynamo, params);
    } catch (error) {
        console.log(error);

        return {
            statusCode: 400,
            body: `Please check all necessary parameters for request`
        }
    }
}

export const main = middyfy(creteProductDynamoDB);