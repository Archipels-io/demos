// @ts-check

const {
  APP_URL,
  APPLICATION_NAME,
  ARCHIPELS_APP_URL,
  JWT_SECRET,
} = require('./constants');
const { axios } = require('./http');
const jwt = require('jsonwebtoken');

/**
 * The config created during setup, containing environment variables.
 * @typedef {Object} SetupConfig
 * @property {string} walletDid - The DID of the main wallet
 * @property {string} invitationCode - The multi invitation code the user will use
 * @property {string} demoSchemaId - The id of your schema used for authentication
 * @property {string} attestationSchemaId - The id of the schema used during signup to verify users
 */

// in memory store used to save holder connection id from initial presentation
const store = new Map();

// issuer source
const ARCHIPELS_ISSUER_SOURCE = 'archipels';
const DEMO_ISSUER_SOURCE = 'demo';

// attributes
const ARCHIPELS_EMAIL_ATTRIBUTE = 'emailAddress';
const DEMO_APPLICATION_ATTRIBUTE = 'application';
const DEMO_ID_ATTRIBUTE = 'id';

// issuer's source by attribute
const attributeIssuerSource = new Map([
  [ARCHIPELS_EMAIL_ATTRIBUTE, ARCHIPELS_ISSUER_SOURCE],
  [DEMO_APPLICATION_ATTRIBUTE, DEMO_ISSUER_SOURCE],
  [DEMO_ID_ATTRIBUTE, DEMO_ISSUER_SOURCE],
]);

/**
 * Generate Archipels presentation link
 *
 * @param {string} type
 * @param {string} invitation
 * @returns {string}
 */
function generateLink(type, invitation) {
  if (!['signup', 'signin'].includes(type)) {
    throw new Error(`Unsupported link type ${type}`);
  }

  return `${ARCHIPELS_APP_URL}/presentation-requests/initialize?message=/${type}&invitation=${invitation}&onboarding=quick`;
}

/**
 * Validate all presentation attributes issuer identifier
 *
 * @param {object} presentation
 * @param {Array.<Object>} catalog
 * @param {SetupConfig} config
 * @returns {boolean}
 */
function validatePresentationIssuer(presentation, catalog, config) {
  return Object.entries(presentation.attributes).every(([key, attribute]) => {
    // invalidate if no source defined
    if (!attributeIssuerSource.has(key)) {
      return false;
    }

    // attribute issuer source is Archipels, check issuer from our catalog
    if (attributeIssuerSource.get(key) === ARCHIPELS_ISSUER_SOURCE) {
      // find all entries matching the schema identifier
      const catalogEntries = catalog.filter(
        (item) => item.schema.did === attribute.schemaId,
      );

      // at least one entry matching the issuer identifier
      return catalogEntries.some(
        (catalogEntry) => catalogEntry.issuer.did === attribute?.issuerDid,
      );
    }

    // our attribute issuer source
    return attribute?.issuerDid === config.walletDid;
  });
}

/**
 * Handle MessageReceived message type
 *
 * @param {object} payload
 * @param {SetupConfig} config
 * @returns {Promise<void>}
 */
async function handleMessageReceived(payload, config) {
  // on initial message save the holder connection id to redirect user on our chat later
  if (payload.init) {
    store.set(payload.connectionId, payload.holderConnectionId);
  }

  switch (payload.content) {
    case 'connection-closed': {
      // @example on connection closed => invalidate access token
      break;
    }

    // signup process initiated
    case '/signup': {
      // send a presentation request with one or more schemas who match your own schema
      await axios
        .post('/presentations/send-request', {
          connectionId: payload.connectionId,
          attributes: {
            // request contains email schema attribue
            [ARCHIPELS_EMAIL_ATTRIBUTE]: { schemaId: config.attestationSchemaId },
            // for example, you can also ask user to present a majority attestation
            // over18: { schemaId: '7yrC9GegTsAAHz5Qc1CJpq:2:Age attestation:1.0' }
          },
          predicates: {},
        })
        .catch((error) => console.error(error.message));
      break;
    }

    // signin process initiated
    case '/signin': {
      // send a presentation request with all attributes required by your schema
      await axios
        .post('/presentations/send-request', {
          connectionId: payload.connectionId,
          attributes: {
            // for each attribute, define which schema will be used for validation
            // @todo: If you change the schema, don't forget to change the attributes here
            [DEMO_APPLICATION_ATTRIBUTE]: { schemaId: config.demoSchemaId },
            [DEMO_ID_ATTRIBUTE]: { schemaId: config.demoSchemaId },
          },
          predicates: {},
        })
        .catch((error) => console.error(error.message));
      break;
    }
  }
}

/**
 * Handle PresentationReceived message type
 *
 * @param {object} payload
 * @param {SetupConfig} config
 * @returns {Promise<void>}
 */
async function handlePresentationReceived(payload, config) {
  const [{ data: presentation }, { data: catalog }] = await Promise.all([
    axios.get(`/presentations/${payload.presentationId}`),
    axios.get("/catalog?walletType=individual"),
  ]).catch((error) => {
    console.error(error.message);
    throw new Error("Could not handle presentation received");
  });
  // @todo: If when modifying the schema, update the attributes below
  const application =
    presentation.attributes?.[DEMO_APPLICATION_ATTRIBUTE]?.value;
  const id = presentation.attributes?.[DEMO_ID_ATTRIBUTE]?.value;
  const email = presentation.attributes?.[ARCHIPELS_EMAIL_ATTRIBUTE]?.value;

  // attributes issuer verification
  if (!validatePresentationIssuer(presentation, catalog, config)) {
    // redirect user who is awaiting on Archipels to chat connection
    if (store.has(payload.connectionId)) {
      await sendUserRedirection(payload.connectionId);
    }

    await axios
      .post('/messages', {
        connectionId: payload.connectionId,
        content: "Bad issuer",
      })
      .catch((error) => console.error(error.message));

    return;
  }

  if (email) {
    // redirect user who is awaiting on Archipels to chat connection
    if (store.has(payload.connectionId)) {
      await sendUserRedirection(payload.connectionId);
    }

    // example of message you can send to a user connection
    await axios
      .post('/messages', {
        connectionId: payload.connectionId,
        content: "Please find your demo application attestation below 🦄🦄🦄",
      })
      .catch((error) => console.error(error.message));

    await axios
      .post('/messages', {
        connectionId: payload.connectionId,
        content: `This attestation will be requested during your signin process at ${APP_URL}`,
      })
      .catch((error) => console.error(error.message));

    // send attestation offer
    await axios
      .post('/attestations/send-offer', {
        connectionId: payload.connectionId,
        schemaId: config.demoSchemaId,
        // @todo: If you change the schema, you must change the following attributes:
        attributes: {
          [DEMO_APPLICATION_ATTRIBUTE]: APPLICATION_NAME,
          [DEMO_ID_ATTRIBUTE]: email,
        },
      })
      .catch((error) => console.error(error.message));

    return;
  }

  // @todo validate attributes on your side if needed (valid email, etc ...)
  if (application === APPLICATION_NAME && id) {
    // create a new access token for these attributes with your {JWT_SECRET} and save it in your system
    const accessToken = jwt.sign(
      {
        application,
        id,
      },
      JWT_SECRET,
    );

    // redirect the user to your app with accessToken
    await sendUserRedirection(
      payload.connectionId,
      `${APP_URL}/secured?accessToken=${accessToken}&id=${id}`,
    );
  }
}

/**
 * Send a message to user to redirect it to chat connection
 *
 * @param {string} connectionId
 * @param {string=} redirection
 * @returns {Promise<void>}
 */
async function sendUserRedirection(connectionId, redirection) {
  await axios
    .post('/messages', {
      connectionId,
      content: JSON.stringify({
        // when redirection is defined, you can empty the message content
        content: '',
        metadata: {
          // use awaiting will be redirected to our chat connection
          redirection:
            redirection ??
            `${ARCHIPELS_APP_URL}/chat/${store.get(connectionId)}`,
        },
      }),
    })
    .catch((error) => console.error(error.message));
}

module.exports = {
  generateLink,
  handleMessageReceived,
  handlePresentationReceived,
};
