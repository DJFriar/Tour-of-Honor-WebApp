const SmartySDK = require("smartystreets-javascript-sdk");
const SmartyCore = SmartySDK.core;
const Lookup = SmartySDK.usAutocompletePro.Lookup;

let key = process.env.SMARTY_API_KEY;
const credentials = new SmartyCore.SharedCredentials(key);

let clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses(["us-autocomplete-pro-cloud"]);
let client = clientBuilder.buildUsAutocompleteProClient();

let lookup = new Lookup("7909 Sloan");

lookup.prefer_geolocation = "CITY";
lookup.maxResults = 10;
lookup.source = "all";

await handleRequest(lookup, "Testing");

function logSuggestions(response, message) {
  console.log(message);
  console.log(response.result);
}

async function handleRequest(lookup, lookupType) {
  try {
    const results = await client.send(lookup);
    logSuggestions(results, lookupType);
  } catch (err) {
    console.log(err);
  }
}

async function lookupAddress(address) {
  let lookup = new Lookup(address);
  lookup.prefer_geolocation = "CITY";
  lookup.maxResults = 10;

  try {
    const results = await client.send(lookup);
    console.log("==== smartyStreets Success ====");
    console.log(results.result);
    return results;
  } catch (err) {
    console.log("==== smartyStreets Error ====");
    console.log(err);
  }
}

exports.lookupAddress = lookupAddress;