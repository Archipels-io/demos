# 01 - Authentication

This example is a **modern**, **secure**, and **privacy-focused** authentication mechanism designed to replace traditional login methods (e.g., usernames and passwords).

By leveraging decentralized identity wallets, you can provide a seamless and secure way for users to authenticate across websites and apps without relying on centralized databases for storing personal credentials.

# Try it out!

Check out the demo live on our website: [demo.archipels.io/authentication](https://demo.archipels.io/authentication)!

https://github.com/user-attachments/assets/e05fc176-7dad-4dac-a001-8f21b6d74a82

# Setting it up locally

This section will help you set up a website where users can sign up and log in without using a password.

You can either [integrate the functionality on your own website](#on-your-own-website) (recommended) or [run the demo locally](#run-the-demo-locally) to explore the code (easier).

If you're interested in the benefits provided by this approach, as well as some more technical background, scroll down to [the appendix](#key-benefits). If you prefer seeing code in action to understand it, keep on reading!

## On your own website

1. Before getting started, follow the [Common steps guide](../COMMON_STEPS.md) to:
- Set up an Achipels wallet with an `ACCESS_TOKEN` ([wallet](../COMMON_STEPS.md#create-a-wallet), [access token](../COMMON_STEPS.md#create-an-access-token))
- Set up a webhook on your wallet ([link](../COMMON_STEPS.md#create-a-webhook))
- Generate an invitation link ([link](../COMMON_STEPS.md#generate-an-invitation-link))

2. Next, you need to implement handlers in your backend to handle the signup and signin messages from your users. You can reuse the code in `src/helpers.js` as a reference.

3. Finally, you need to add the signup and signin links to your website. These links have the following format (don't forget to replace `${type}` by `signup` or `signin` and `${invitation}` by the invitation link you received):

```
https://app-api.archipels.io/presentation-requests/initialize?message=/${type}&invitation=${invitation}&onboarding=quick
```

That's it, you're all set up! 🎉
If you want to learn more about the different steps, keep on reading!

### Workflow

The demo is composed of two main steps, the `signup` and `signin`.

#### Signup

![Sign up UML diagram](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Archipels-io/demos/main/authentication/signup.iuml)

1. A user clicks on your signup invitation link and is redirected to our web application
2. You receive a message to start the signup process
3. Send them a request to present a verified email address
4. You receive a presentation containing the requested data
5. Send them back an attestation offer with your custom schema

> **Important :** when you receive a presentation, validate each presentation attribute issuer to ensure that you can trust the source of the data (see the `validatePresentationIssuer` method in `helpers.js`).

Users can accept your attestation offer to add it to their personal wallet for a future signin process

#### Signin
 
![Sign up UML diagram](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Archipels-io/demos/main/authentication/signin.iuml)

1. A user clicks on your signin invitation link and is redirected to our web application
2. You receive a message to start the signin process
3. Send them a request to present a verified id and application name
4. You receive a presentation containing the requested data

> **Important :** when you receive a presentation, validate each presentation attribute issuer to ensure that you can trust the source of the data (during signin, it should be you!)

You can then do whatever you want, validate the email, generate a private access token to authenticate the user on your own API, etc...

## Run the demo locally

### Getting started

First, make sure you've created a wallet to represent your website when users try to authenticate on it. To do this, you can follow the [Common steps guide](../COMMON_STEPS.md#create-a-wallet).

Also don't forget to create an `ACCESS_TOKEN` to access your wallet (see [this section in the guide](../COMMON_STEPS.md#create-an-access-token)).

Now, clone this repository and move to the next step!

> Set your `ACCESS_TOKEN` as an environment variable or change it in the `src/constants.js` file.

### Tunneling your localhost

When running **locally**, we will use tunneling to allow users to call back your application. You can use any available solution, in this example we will use [ngrok](https://ngrok.com/docs/getting-started/):

```shell
ngrok http localhost:5001
```

This will give you the URL your website will be available at. Set it as an environment variable or change it in the `src/constants.js` file.

> When deploying on your own domain, you can skip the tunneling step, but don't forget to set the `APP_URL` to your website's URL.

### Installation

Select the directory `authentication` and install the dependencies:

```shell
npm ci
```

### Start the demo

To start the demo:

```shell
npm run start
```

Now, visit your app's URL to see the magic in action!
You may have to use another browser or clear your cookies to simulate a distinct user.

Alternatively, you can also use the provided Dockerfile to run the demo in a container.

# Want to go further?

If you want to dig deeper in this example, here are a few steps you can take:
1. [Ask for a different attestation](#ask-for-a-different-attestation)
2. [Discover how invitations are resolved](#discover-how-invitations-are-resolved)
3. [Create a custom schema](#create-a-custom-schema)
4. [Check out our docs](#check-out-our-docs)

## Ask for a different attestation

To ask the user for a different attestation, simply modify the `ATTESTATION_SCHEMA_ID` to choose the schema you want to use. You can also [create your own schema](#create-a-custom-schema). If you don't want to ask the user for an attestation on signup, simply remove the checks in `index.js` and `helpers.js`.

## Discover how invitations are resolved

When calling the /connections/create-invitation, you receive an invitation, encoded as a JWT token. If you want to sent it to your users without forcing them to make API calls, simply embed it in a link:

https://app.archipels.io/presentation-requests/initialize?message=${message}&invitation=${invitation}

After clicking the link, the user will be redirected to select a wallet they want to use (or create one if they don't have one yet). Once authenticated, it will send the message you specified back to the owner (you). In this app, we use it to send /signup and /signin commands in the chat, but you can customize it!

## Create a custom schema

Use our api to create a schema :

```curl
curl --location 'https://app-api.archipels.io/schemas' \
--header 'wallet: {WALLET_DID}' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {ACCESS_TOKEN}' \
--data '{"owner":"demo","public":true,"tags":["demo"],"description":"demo","attributes":[{"description":"demo application","name":"application"},{"description":"demo id","name":"id"}],"name":"Demo","version":"0.1"}'
```

> **Notes :** In this schema, we are defining two attributes `application` and `id`.

You will receive the following response format :

```json
{
  "id": "25a086d5-966d-4963-bedb-d953db8cb713",
  "schemaId": "C8kQSU4bHyh1A2YvQ9TyLU:2:Demo:0.1",  // <-- The schema id
  "name": "Demo",
  "version": "0.1",
  "attributes": [
    {
      "name": "application",
      "description": "demo application"
    },
    {
      "name": "id",
      "description": "demo id"
    }
  ],
  "description": "demo",
  "tags": ["demo"],
  "public": true
}
```

Then, in `src/constants.js`:
- If you want to use this schema to represent your users, set the value of `DEMO_SCHEMA_ID` to your new schema id. You will also need to modify the code in `helpers.js` to generate the attestation correctly.
- If you want to use this schema for validating users before sign in, set the `ATTESTATION_SCHEMA_ID` property. However, note that you are most likely the only verifier who will agree to deliver such attestations, which does defeat the purpose.

## Check out our docs

For a more general reference about our APIs, make sure to check out our [documentation](https://docs-v1.archipels.io/archipels-documentation)!

## Key Benefits
-   **Enhanced Security:** With decentralized identity wallets, users' sensitive information remains in their control. This reduces the risk of data breaches and unauthorized access to personal data.

-   **Easy Integration:** Our solution is designed to be easily integrated into existing websites and applications, with minimal setup required. Whether you're building an app or running a website, you can get started quickly with our clear documentation and example code.

-   **Customizable:** The authentication mechanism is highly flexible, allowing developers to tailor the solution to fit the specific needs of their platform. Sign-up requirements can be customized to fit your project and Login attestation can include any attribute that you may need to manage roles and permissions for your project.

-   **User-Centric:** Users remain in full control of their digital identity, choosing how and when to share their information, creating a more privacy-respecting experience.

## Additional details

### Directory structure

In this directory you will find a `public` directory for assets, a `views` directory for the main template and `src` directory containing the javascript source files :

- constants: contains all constant for Archipels and your config
- helpers: utility methods
- http: configured Axios instance
- index: express app with middlewares, routes, etc...
- setup: A default setup that reduces the number of manual steps. Can be skipped once you are building your own implementation 
