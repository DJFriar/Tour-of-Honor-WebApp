require('dotenv').config();
const fetch = require('isomorphic-fetch');

const storefrontToken = process.env.SHOPIFY_STOREFRONT_KEY;
const url = process.env.SHOPIFY_SHOP_API_ENDPOINT;

const connection = {
  url,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontToken,
  },
};

function buildGraphQLQuery() {
  const query = `mutation ($id:ID!) {
    checkoutCreate(input: {
    lineItems: [{ variantId: $id, quantity: 1 }]
}) {
    checkout {
        id
        webUrl
    }
}
}`;
  return query;
}

function buildGraphQLQueryToGetOrderNumber() {
  const query = `query ($id:ID!) { 
    node(
      id: $id
    ) {
      id
      ... on Checkout {
      id
      order {
          canceledAt
          id
          name
          email
      }
      }
    }
  }`;
  return query;
}

function getQueryVars(id) {
  // const id = id;
  const queryVars = { id };
  return queryVars;
}

async function postQuery(query, queryVars) {
  const res = await fetch(connection.url, {
    method: 'POST',
    headers: connection.headers,
    body: JSON.stringify({
      query,
      variables: queryVars,
    }),
  });

  if (res.status === 200) {
    const response = await res.json();
    return response;
  }
  // throw res.statusText;
  return false;
}

async function generateShopifyCheckout(variantid) {
  const query = buildGraphQLQuery();
  const queryVars = getQueryVars(variantid);
  const createCheckoutResponse = await postQuery(query, queryVars);
  const checkoutURL = createCheckoutResponse.data.checkoutCreate.checkout.webUrl;
  const checkoutID = createCheckoutResponse.data.checkoutCreate.checkout.id;
  const checkoutDetails = {
    CheckoutURL: checkoutURL,
    CheckoutID: checkoutID,
  };

  return checkoutDetails;
}

async function checkOrderStatusByCheckoutID(checkoutid) {
  const query = buildGraphQLQueryToGetOrderNumber();
  const queryVars = getQueryVars(checkoutid);
  const orderStatusResponse = await postQuery(query, queryVars);
  // console.debug(orderStatusResponse)
  const orderNumber = orderStatusResponse.data.node.order.name;

  return orderNumber.slice(1);
}

exports.generateShopifyCheckout = generateShopifyCheckout;
exports.checkOrderStatusByCheckoutID = checkOrderStatusByCheckoutID;
