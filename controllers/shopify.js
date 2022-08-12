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

async function getCheckoutURL(id) {
  query = buildGraphQLQuery();
  query_vars = getQueryVars(id);
  response = await postQuery(query, query_vars)
  checkoutURL = response.data.checkoutCreate.checkout.webUrl;
  console.log("==== getCheckoutURL() ====");
  console.log(checkoutURL);

  return checkoutURL;
}

async function main(){
    query = buildGraphQLQuery()
    // uncomment to see raw query body
    // console.log(query)
    query_vars = getQueryVars("gid://shopify/ProductVariant/39851016749111")
    // uncomment to view raw query params
    // console.log(query_vars)
    response = await postQuery(query,query_vars)
    // console.debug(response)
    if (response.data.checkoutCreate)
      console.debug(response.data.checkoutCreate)
      console.debug(response.data.checkoutCreate.checkout.webUrl)
    // console.debug(response.errors[0].locations)
    // console.debug(response.errors[0].extensions)
}

// main()

exports.getCheckoutURL = getCheckoutURL










// const adminApiClient = new Shopify.Clients.Rest(
//   process.env.SHOPIFY_SHOP,
//   process.env.SHOPIFY_ADMIN_KEY,
// );

// const storefrontTokenResponse = await adminApiClient.post({
//   path: 'storefront_access_tokens',
//   type: DataType.JSON,
//   data: {
//     storefront_access_token: {
//       title: 'This is my test access token',
//     },
//   },
// });

// const storefrontAccessToken = storefrontTokenResponse.body['storefront_access_token']['access_token'];
// const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_KEY;
// const shop = process.env.SHOPIFY_SHOP;

// const storefrontClient = new Shopify.Clients.Storefront(
//   shop,
//   storefrontAccessToken
// );

// let checkoutData = {
//   data: `{
//     mutation {
//       checkoutCreate(input: {
//         allowPartialAddresses: true,
//         customAttributes: {
//           key: "PortalUserID",
//           value: "1"
//         },
//         lineItems: [{ 
//           quantity: 1,
//           variantId: "gid://shopify/ProductVariant/39851016749111", 
//         }],
//       }) {
//         checkout {
//           id
//           webUrl
//           lineItems(first: 1) {
//             edges {
//               node {
//                 title
//               }
//             }
//           }
//         }
//       }
//     }
//   }`
// }

// function generateCheckout(variantId) {




//   return checkout = await storefrontClient.query(checkoutData)
// }

// exports.generateCheckout = generateCheckout