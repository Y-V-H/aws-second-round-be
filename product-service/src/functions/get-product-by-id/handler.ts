import { getProducts } from '../../helpers/get-products';
import { middyfy } from '@libs/lambda';

export const getProductById = async (event) => {
  const { productId } = event.pathParameters;

  try{
      const products = await getProducts();
      let result = products.filter((el) => {
        return el.id === productId 
      })
  
      if(!result.length) {
        throw new Error();
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
      }
    } catch(e) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Failed to load product with ID ${productId}`
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
      }
    }
  }

  export const main = middyfy(getProductById);