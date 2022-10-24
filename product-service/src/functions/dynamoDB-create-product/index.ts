import { handlerPath } from '@libs/handler-resolver';

export const creteProductDynamoDB = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'POST',
                path: 'products',
                cors: true,
            },
        },
    ],
};