'use strict';

const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { headers } = require('../utils/headers');
const BUCKET = 'task-5-uploaded-y-hurynovich';
const s3 = new S3Client({ region: 'eu-west-1' });

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
            expiresIn: 100,
        });

        return {
            statusCode: 200,
            headers,
            body: signedUrl,
        }

    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: `Failed with: ${error}`
            }),
        }
    }

}
