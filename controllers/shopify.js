const { createStorefrontApiClient } = require('@shopify/storefront-api-client');

require('dotenv').config();
const { logger } = require('./logger');

// const url = process.env.SHOPIFY_SHOP_API_ENDPOINT;

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_SHOP,
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_KEY,
  apiVersion: '2025-04',
});

const createCartMutation = `mutation createCart($cartInput: CartInput!) {
  cartCreate(input: $cartInput) {
    cart {
      attributes {
        key
        value
      }
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

async function generateShopifyCheckout(variantid, userid) {
  logger.info(`Generating Shopify checkout for User ID: ${userid} & Variant ID: ${variantid}`, {
    calledFrom: 'controllers/shopify.js',
  });
  const { data, errors } = await client.request(createCartMutation, {
    variables: {
      cartInput: {
        attributes: [
          {
            key: 'UserID_Year',
            value: `${userid}_${process.env.CURRENT_RALLY_YEAR}`,
          },
        ],
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
    logger.error(errors.message);
  }

  const checkoutURL = data.cartCreate.cart.checkoutUrl;
  const checkoutID = data.cartCreate.cart.id;
  const checkoutDetails = {
    CheckoutURL: checkoutURL,
    CheckoutID: checkoutID,
  };

  logger.debug('Checkout URL: ', checkoutURL);
  logger.debug('Checkout ID: ', checkoutID);

  return checkoutDetails;
}

const createOrderStatusByCheckoutIDMutation = `query ($id:ID!) { 
  node(id: $id) {
    id
  }
}`;

async function checkOrderStatusByUserID(checkoutid) {
  logger.info(`Checking order status for checkout ID: ${checkoutid}`, {
    calledFrom: 'controllers/shopify.js',
  });
  const { data, errors } = await client.request(createOrderStatusByCheckoutIDMutation, {
    variables: {
      id: checkoutid,
    },
  });

  if (errors) {
    logger.error(errors.message);
    logger.error(errors.graphQLErrors);
  }

  logger.info('==== RAW data object ====');
  logger.info(data);
  const { orderNumber } = data.node.order;
  logger.info(`orderNumber is: ${orderNumber}`);

  return orderNumber.slice(1);
}

exports.generateShopifyCheckout = generateShopifyCheckout;
exports.checkOrderStatusByUserID = checkOrderStatusByUserID;
