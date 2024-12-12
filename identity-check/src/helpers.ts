import { ARCHIPELS_APP_URL, VERIFICATION_SCHEMA_ID } from "./constants.ts";
import { axios } from "./http.ts";

// in memory store used to save holder connection id from initial presentation
const store = new Map();

async function handleMessageReceived(
  payload: {
    init: boolean;
    connectionId: string;
    holderConnectionId: string;
    content: string;
  },
) {
  // on initial message save the holder connection id to redirect user on our chat later
  if (payload.init) {
    store.set(payload.connectionId, payload.holderConnectionId);
  }

  switch (payload.content) {
    case "connection-closed": {
      // @example on connection closed => invalidate access token
      break;
    }

    case "/verify-identity": {
      const requestBody = {
        connectionId: payload.connectionId,
        attributes: {
          "firstName": {
            schemaId: VERIFICATION_SCHEMA_ID,
          },
          "lastName": {
            schemaId: VERIFICATION_SCHEMA_ID,
          },
        },
        predicates: {},
      };
      await axios
        .post("/presentations/send-request", requestBody)
        .catch((error) => console.error(error.message));
      break;
    }
  }
}

async function handlePresentationReceived(payload: { presentationId: string }) {
  const { data: presentation } = await axios.get(
    `/presentations/${payload.presentationId}`,
  )
    .catch((error) => {
      console.error(error.message);
      throw new Error("Could not handle presentation received");
    });

  const { firstName, lastName } = presentation.attributes;

  return {
    firstName,
    lastName,
  };
}

async function sendUserRedirection(connectionId: string, redirection?: string) {
  await axios
    .post("/messages", {
      connectionId,
      content: JSON.stringify({
        // when redirection is defined, you can empty the message content
        content: "",
        metadata: {
          // use awaiting will be redirected to our chat connection
          redirection: redirection ??
            `${ARCHIPELS_APP_URL}/chat/${store.get(connectionId)}`,
        },
      }),
    })
    .catch((error) => console.error(error.message));
}

export {
  handleMessageReceived,
  handlePresentationReceived,
  sendUserRedirection,
};
