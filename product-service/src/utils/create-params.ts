import { v4 as uuidv4 } from 'uuid';

export const createParams = (patams: any) => {
    const uId = uuidv4();

    return {
        RequestItems: {
            'products': [
                {
                    PutRequest: {
                        Item: {
                            id: { S: uId },
                            description: { S: patams.description },
                            price: { N: patams.price.toString() },
                            title: { S: patams.title },
                            image: { S: 'https://cdn.shopify.com/s/files/1/0420/2774/5443/products/zuiho-optco-honor-sl-520333_1100x.jpg?v=1640014494' }
                        }
                    }
                }
            ],
            'stocks': [
                {
                    PutRequest: {
                        Item: {
                            id: { S: uId },
                            count: { S: patams.count.toString() },
                        }
                    }
                }
            ],
        }
    };
}