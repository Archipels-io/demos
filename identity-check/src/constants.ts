// Environment variables to change
const ACCESS_TOKEN = getEnv("ACCESS_TOKEN");
const APP_URL = getEnv("APP_URL");
const VERIFICATION_SCHEMA_ID = getEnv("VERIFICATION_SCHEMA_ID");
const WALLET_DID = getEnv("WALLET_DID");
const WEBHOOK_SECRET = getEnv("WEBHOOK_SECRET");
const JWT_SECRET = getEnv("JWT_SECRET");

const ARCHIPELS_API_URL = "https://app-api.archipels.io"; // Change if you used another environment for your wallet
const ARCHIPELS_APP_URL = "https://app.archipels.io"; // Change if you used another environment for your wallet

function getEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`${key} is not set`);
  }
  return value;
}

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
