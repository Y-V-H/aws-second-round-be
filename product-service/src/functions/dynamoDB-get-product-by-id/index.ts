import { handlerPath } from '@libs/handler-resolver';

export const getProductByIdDynamoDB = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'product/{productId}',
                cors: true,
            },
        },
    ],
};