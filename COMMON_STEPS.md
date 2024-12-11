# Common steps

This guide will help you get started with the examples in this repository. It is intended as a reference, so if you have a specific example you want to run, refer to its README for more details. It will contain everything you need.

If you don't have a specific example in mind, why not try [simple authentication](./authentication/README.md)?

Most of the steps are taken from our [docs](https://docs-v1.archipels.io/archipels-documentation), which are more complete. There is no need to read them in detail to understand the examples here, but if anything is unclear, don't hesitate to refer to them.

## Contents

- [Create a Wallet](#create-a-wallet)
- [Create an access token](#create-an-access-token)


## Create a Wallet

Go to [Archipels](https://app.archipels.io) and follow the onboarding process to create your personal or business wallet.

## Create an access token

Go to [Settings > Access tokens](https://app.archipels.io/settings-access-token) and click on "**Create an access token**", set a token name and select all scopes, then click create.

> **Important:** save your `ACCESS_TOKEN`

## Create a webhook

If you want to be notified of events, you can create a webhook. Archipels will send you notifications about your wallet to the URL you specify.

To ensure the authenticity of the requests, you need to choose a secret. This secret will be sent in the `x-connect-token` header of the requests.

Go to [Settings > Webhooks](https://app.archipels.io/settings-webhooks) and click on "**Create a webhook**". If you're not sure which events you want to be notified of, select everything.

> **Important:** remember your `WEBHOOK_SECRET`

## Fetch your wallet DID

To fetch your wallet DID, run the following curl command, replacing `${ACCESS_TOKEN}` by your own value:

```bash
curl -L -X GET 'https://app-api.archipels.io/wallets' \
  -H 'Authorization: Bearer ${ACCESS_TOKEN}'
```

In the response, look for the wallet you want to use and copy one of its DIDs. If you have jq, pipe the output of the command to it:

```bash
| jq '.results[0].dids[0]'
```

## Generate an invitation link

To generate an invitation link, run the following curl command, replacing `${ACCESS_TOKEN}` and `${WALLET_DID}` by your own values:

```bash
curl -L -X POST 'https://app-api.archipels.io/connections/create-invitation' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ${ACCESS_TOKEN}' \
  -H 'Wallet: ${WALLET_DID}' \
  -d '{
    "multiUse": true,
    "label": "Demo"
  }'
```

The response will contain the invitation link you can share with your users.
