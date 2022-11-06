import { handlerPath } from '@libs/handler-resolver';

export const getProductsListDynamoDB = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
      },
    },
  ],
};