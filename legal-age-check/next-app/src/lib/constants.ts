// Environment variables to change
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const APP_URL = process.env.APP_URL;
const VERIFICATION_SCHEMA_ID = process.env.VERIFICATION_SCHEMA_ID;
const WALLET_DID = process.env.WALLET_DID;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const ARCHIPELS_API_URL = "https://app-api.archipels.io"; // Change if you used another environment for your wallet
const ARCHIPELS_APP_URL = "https://app.archipels.io"; // Change if you used another environment for your wallet

export {
  ACCESS_TOKEN,
  APP_URL,
  ARCHIPELS_API_URL,
  ARCHIPELS_APP_URL,
  VERIFICATION_SCHEMA_ID,
  WALLET_DID,
  WEBHOOK_SECRET,
  JWT_SECRET,
};
