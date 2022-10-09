import { getProducts } from '../../helpers/get-products';
import { middyfy } from '@libs/lambda';

export const getProductsList = async () => {
  const products = await getProducts();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      }
    };
  };

  export const main = middyfy(getProductsList);