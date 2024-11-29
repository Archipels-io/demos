// Environment variables to change
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Can be found in your profile settings
const APP_URL = process.env.APP_URL; // Your app URL. When running locally, replace with the URL ngrok (or similar) provided
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "demo"; // The token you specified when creating the webhook.

// Additional configuration (not necessary the first time)
const ARCHIPELS_API_URL = 'https://app-api.archipels.io'; // Change if you used another environment for your wallet
const ARCHIPELS_APP_URL = 'https://app.archipels.io'; // Change if you used another environment for your wallet
const ATTESTATION_SCHEMA_ID = null; // The id of the schema you request from users. If null, specify its name to find it
const ATTESTATION_SCHEMA_NAME = "Email attestation";

const APPLICATION_NAME = 'demo';
const JWT_SECRET = 'jwt_secret'; // Be sure to change this in a production environment
const DEMO_SCHEMA_ID = null; // If you want to issue attestations with your own schema, specify the id here
const DEMO_SCHEMA_NAME = "Demo"; // If the schema is not found by id, this name will be used to find/create it
const WALLET_DID = null; // Choose your wallet if multiple exist on your account

module.exports = {
  APP_URL,
  APPLICATION_NAME,
  ARCHIPELS_API_URL,
  ARCHIPELS_APP_URL,
  WALLET_DID,
  ACCESS_TOKEN,
  WEBHOOK_SECRET,
  JWT_SECRET,
  ATTESTATION_SCHEMA_ID,
  ATTESTATION_SCHEMA_NAME,
  DEMO_SCHEMA_ID,
  DEMO_SCHEMA_NAME,
};
