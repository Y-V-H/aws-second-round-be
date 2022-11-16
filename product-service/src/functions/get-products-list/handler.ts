import { getProducts } from '../../helpers/get-products';
import { middyfy } from '@libs/lambda';
import { headers } from '../../utils/headers';

export const getProductsList = async () => {
  const products = await getProducts();

  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: headers
  };
};

export const main = middyfy(getProductsList);