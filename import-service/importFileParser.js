'use strict';

const AWS = require('aws-sdk');
const csv = require('csv-parser');
const BUCKET = 'task-5-uploaded-y-hurynovich';

const s3 = new AWS.S3({ region: 'eu-west-1' });
const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
};

const copyAndDelete = (params, record) => {
    return new Promise((resolve, reject) => {
        s3.getObject(params).createReadStream()
            .pipe(csv())
            .on('data', (data) => console.log(data))
            .on('end', async () => {
                console.log('before copy object');
                await s3.copyObject({
                    Bucket: BUCKET,
                    CopySource: BUCKET + '/' + record.s3.object.key,
                    Key: record.s3.object.key.replace('uploaded', 'parsed')
                }).promise();
                console.log(record.s3.object.key, "was copied");

                await s3.deleteObject({
                    Bucket: BUCKET,
                    Key: record.s3.object.key
                }).promise();
                console.log(record.s3.object.key, "was deleted");

                resolve();
            })
            .on("error", (error) => {
                console.log(error);
                reject(error);
            });
    })
}

module.exports.importFileParser = async (event) => {
    try {
        console.log('importFileParser with', event.Records)

        for (const record of event.Records) {
            const params = {
                Bucket: BUCKET,
                Key: record.s3.object.key,
            };

            await copyAndDelete(params, record);
        }

        return {
            statusCode: 200,
            headers: headers,
            body: 'success',
        }
    } catch (error) {
        console.error(error)

        return {
            statusCode: 500,
            headers: headers,
            body: error,
        }
    }
}