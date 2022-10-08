require('dotenv').config();
const fetch = require("isomorphic-fetch");

const storefrontToken = process.env.SHOPIFY_STOREFRONT_KEY;
const url = process.env.SHOPIFY_SHOP_API_ENDPOINT;

const connection = {
    url,
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': storefrontToken },
}

function buildGraphQLQuery(){
  var query = `mutation ($id:ID!) {
    checkoutCreate(input: {
    lineItems: [{ variantId: $id, quantity: 1 }]
}) {
    checkout {
        id
        webUrl
    }
}
}`;
    return query
}

function buildGraphQLQueryToGetOrderNumber(){
  var query = `query ($id:ID!) { 
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
    return query
}

function getQueryVars(id){
  var id = id;
  var query_vars = { id };
  return query_vars;
}

async function postQuery(query, query_vars){
    try {
        console.log("Processing GraphQL Query.");
        const res = await fetch(connection.url, {
            method: "POST",
            headers: connection.headers,
            body: JSON.stringify({
              query,
              variables: query_vars,
            })
        })

        if (res.status == 200){
            // console.debug(res.statusText)
            console.log("postQuery completed successfully.");
            var response = await res.json();
            return response;
        } else {
            console.log("ERROR: "+res.status+": "+res.statusText)
            //throw res.statusText;
            return false;
        }
    } catch(err) { 
      throw err
    }
}

async function generateShopifyCheckout(variantid) {
  query = buildGraphQLQuery();
  query_vars = getQueryVars(variantid);
  createCheckoutResponse = await postQuery(query, query_vars)
  checkoutURL = createCheckoutResponse.data.checkoutCreate.checkout.webUrl;
  checkoutID = createCheckoutResponse.data.checkoutCreate.checkout.id;
  var checkoutDetails = {
    CheckoutURL: checkoutURL,
    CheckoutID: checkoutID
  }

  return checkoutDetails;
}

async function checkOrderStatusByCheckoutID(checkoutid) {
  query = buildGraphQLQueryToGetOrderNumber();
  query_vars = getQueryVars(checkoutid);
  orderStatusResponse = await postQuery(query, query_vars)
  console.debug(orderStatusResponse)
  orderNumber = orderStatusResponse.data.node.order.name;

  return orderNumber.slice(1);
}

exports.generateShopifyCheckout = generateShopifyCheckout
exports.checkOrderStatusByCheckoutID = checkOrderStatusByCheckoutID
