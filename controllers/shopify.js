const { createStorefrontApiClient } = require('@shopify/storefront-api-client');

require('dotenv').config();

// const url = process.env.SHOPIFY_SHOP_API_ENDPOINT;

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_SHOP,
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_KEY,
  apiVersion: '2025-04',
});

const createCartMutation = `mutation createCart($cartInput: CartInput!) {
  cartCreate(input: $cartInput) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}`;

const createOrderStatusByCheckoutIDMutation = `query ($id:ID!) { 
  node(id: $id) {
    id
    order {
      id
      orderNumber
    }
  }
}`;

async function generateShopifyCheckout(variantid) {
  const { data, errors } = await client.request(createCartMutation, {
    variables: {
      cartInput: {
        lines: [
          {
            quantity: 1,
            merchandiseId: variantid,
          },
        ],
      },
    },
  });

  if (errors) {
    console.error(errors.message);
  }

  const checkoutURL = data.cartCreate.cart.checkoutUrl;
  const checkoutID = data.cartCreate.cart.id;
  const checkoutDetails = {
    CheckoutURL: checkoutURL,
    CheckoutID: checkoutID,
  };

  console.log('Checkout URL: ', checkoutURL);
  console.log('Checkout ID: ', checkoutID);

  return checkoutDetails;
}

async function checkOrderStatusByCheckoutID(checkoutid) {
  const { data, errors } = await client.request(createOrderStatusByCheckoutIDMutation, {
    variables: {
      id: checkoutid,
    },
  });

  if (errors) {
    console.error(errors.message);
    console.error(errors.graphQLErrors);
  }

  console.log('==== RAW data object ====');
  console.log(data);
  const { orderNumber } = data.node.order;
  console.log(`orderNumber is: ${orderNumber}`);

  return orderNumber.slice(1);
}

exports.generateShopifyCheckout = generateShopifyCheckout;
// exports.checkOrderStatusByCheckoutID = checkOrderStatusByCheckoutID;
