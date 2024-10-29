// @ts-check

const {
    WALLET_DID,
    APP_URL,
    WEBHOOK_SECRET,
    DEMO_SCHEMA_ID,
    DEMO_SCHEMA_NAME,
    APPLICATION_NAME,
    ATTESTATION_SCHEMA_ID,
    ATTESTATION_SCHEMA_NAME
} = require("./constants");
const { axios } = require('./http');

/**
 * Set up the issuer's wallet to be ready to authenticate the user
 * 
 * Create a multi invitation
 *
 * @returns {Promise<import("./helpers").SetupConfig>}
 */
async function setupDefaultWallet() {
    console.log("Setting up wallet...");
    const walletDid = await getWalletDid();
    await ensureWebhookExists();
    const demoSchemaId = await getSchemaId(DEMO_SCHEMA_ID, DEMO_SCHEMA_NAME, true);
    const attestationSchemaId = await getSchemaId(ATTESTATION_SCHEMA_ID, ATTESTATION_SCHEMA_NAME, false);
    const invitationCode = await createMultiInvitation();
    console.log("Wallet setup complete");
    return {
        walletDid,
        invitationCode,
        demoSchemaId,
        attestationSchemaId,
    };
}

/**
 * Get the wallet DID from the user-specified constants
 * If null, fetch from user's account using access token
 *
 * @returns {Promise<string>}
 */
async function getWalletDid() {
    if (WALLET_DID != null) {
        console.log("Using provided wallet DID:", WALLET_DID);
        return WALLET_DID;
    }
    const { data } = await axios.get('/wallets').catch((error) => {
        console.error(error.message);
        throw new Error("Could not fetch wallet DID");
    });
    if (data.length === 0) {
        throw new Error("Could not find a wallet with the provided access token");
    } if (data.length > 1) {
        throw new Error("Found multiple wallets with the access token. Please set the WALLET_DID property");
    }
    const walletDids = data[0].dids;
    const walletDid = walletDids[0]; // Any DID for the wallet should work
    console.log("Found wallet DID:", walletDid);
    axios.defaults.headers.wallet = walletDid;
    return walletDid;
}

/**
 * Create webhook for user's wallet, used for sending messages
 * to this application, if it does not exist yet
 *
 * @returns {Promise<void>}
 */
async function ensureWebhookExists() {
    const webhookUrl = `${APP_URL}/workflow`;
    const { data: webhooks } = await axios.get("/webhooks")
        .catch((error) => {
            console.error(error.message);
            throw new Error("Could not fetch webhooks");
        });
    if (webhooks.some(webhook => webhook.url === webhookUrl)) {
        console.log("Webhook", webhookUrl, "found on wallet, skipping creation...");
        return;
    }
    const { data: events } = await axios.get("/webhooks/events")
        .catch((error) => {
            console.error(error.message);
            throw new Error("Could not fetch webhook events");
        });
    const requestBody = {
        url: webhookUrl,
        token: WEBHOOK_SECRET,
        events,
    };
    await axios.post("/webhooks", requestBody)
        .catch((error) => {
            console.error(error.message);
            throw new Error("Could not create webhook");
        });
    console.log("Created webhook", webhookUrl);
}

/**
 * Get the schema ID from the params
 * 
 * @param {string | null} id
 * @param {string} defaultName - The name to use if the schema id is not provided
 * @param {boolean} createIfNotFound - Whether to create the schema if it does not exist
 * 
 * @returns {Promise<string>}
 */
async function getSchemaId(id, defaultName, createIfNotFound) {
    if (id != null) {
        console.log("Using provided ID for", defaultName, "(existence not verified):", id);
        return id;
    }
    const { data: schemas } = await axios.get("/schemas")
        .catch((error) => {
            console.error(error.message);
            throw new Error("Could not fetch schemas");
        });
    const schemasWithCorrectName = schemas.filter(schema => schema.name === defaultName);
    if (schemasWithCorrectName.length === 1) {
        const chosenSchema = schemasWithCorrectName[0];
        console.log("Found", defaultName, "schema using name:", chosenSchema.schemaId);
        return chosenSchema.schemaId;
    } if (schemasWithCorrectName.length > 1) {
        console.log("Found multiple", defaultName, "schemas, using the first one:", schemasWithCorrectName[0].schemaId);
        console.log("Set the SCHEMA_ID property to override this");
        return schemasWithCorrectName[0].schemaId;
    }
    if (!createIfNotFound) {
        throw new Error(`Could not find ${defaultName} schema`);
    }
    const requestBody = {
        owner: "Demo",
        public: true,
        description: defaultName,
        attributes: [
            {
                description: "id",
                name: "id"
            },
            {
                description: "application",
                name: "application"
            }
        ],
        version: "1.0",
        name: defaultName,
    };

    const { data } = await axios.post("/schemas", requestBody)
        .catch((error) => {
            console.error(error.message);
            throw new Error(`Could not create ${defaultName} schema`);
        });
    console.log("Could not find", defaultName, "schema, created one with id:", data.schemaId);
    return data.schemaId;
}

/**
 * Create a multi invitation to use on the demo website
 * 
 * @returns {Promise<string>}
 */
async function createMultiInvitation() {
    const { data } = await axios.post("/connections/create-invitation", {
        multiUse: true,
        label: APPLICATION_NAME,
    })
        .catch((error) => {
            console.error(error.message);
            throw new Error("Could not create multi invitation");
        });
    console.log("Created multi invitation");
    return data.invitation;
}

module.exports = { setupDefaultWallet };
