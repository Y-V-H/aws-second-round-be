'use strict';

const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const BUCKET = 'task-5-uploaded-y-hurynovich';
const s3 = new S3Client({ region: 'eu-west-1' });

const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
};

module.exports.importProductsFile = async (event) => {
    console.log('event', event);

    try {
        const fileName = event.queryStringParameters.name;
        const filePath = `uploaded/${fileName}`;
        const params = {
            Bucket: BUCKET,
            Key: filePath,
            ContentType: 'text/csv',
        };
        console.log('params was created', params);

        const command = new PutObjectCommand(params);
        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 60,
        });

        return {
            statusCode: 200,
            headers: headers,
            body: signedUrl,
        }

    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                error: `Failed with: ${error}`
            }),
        }
    }

}
