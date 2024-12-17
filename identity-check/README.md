# 02 - Identity check

This example illustrates how to easily integrate an identity check on your website, using the Archipels wallet.

Using secure credentials, you can confirm the identity of your users without ever having to store any personal documents on your servers. The process is easy to set up on your side, and guarantees a seamless user experience.

## Try it out!

Check out the demo live on our website: [demo.archipels.io/identity-check](https://demo.archipels.io/identity-check)!

This video shows the demo in action:

https://github.com/user-attachments/assets/175bd215-d315-4ee5-a986-2cb697b48897

## First time interacting with SSI concepts?

If you're a complete beginner to the topic, we recommend you to read the [_Feeling lost?_ section in the main README](../README.md#feeling-lost) first.

## How does it work?

If you want to set up the example locally, follow this guide.

The key steps in this example are:
1. Your Archipels wallet, which will be used to communicate with your users. Go ahead and create one on [app.archipels.io](https://app.archipels.io) if you don't have one yet.
2. When a user arrives on your website and wants to check their identity, we connect their wallet to yours, based on an invitation link.
3. They will then send you a message, `/verify-identity`. By adding a webhook to your wallet, you can react to it by asking them to present their identity proof
4. The Archipels wallet handles the rest of the process, and sends you another webhook once the identity check is complete.

![Verify identity UML diagram](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Archipels-io/demos/main/identity-check/verify-identity.iuml)

In this demo, we are using a simple Express server to handle the webhooks, and redirect the user to a secured page once the identity check is complete.
You can either [integrate the functionality on your own website](#on-your-own-website) (recommended) or [run the demo locally](#run-the-demo-locally) to explore the code (easier).

## On your own website

1. Before getting started, follow the [Common steps guide](../COMMON_STEPS.md) to:
- Set up an Achipels wallet with an `ACCESS_TOKEN` ([wallet](../COMMON_STEPS.md#create-a-wallet), [access token](../COMMON_STEPS.md#create-an-access-token))
- Set up a webhook on your wallet ([link](../COMMON_STEPS.md#create-a-webhook))
- Generate an invitation link ([link](../COMMON_STEPS.md#generate-an-invitation-link))

2. Next, you need to implement handlers in your backend to handle the /verify-identity messages from your users. You can reuse the code in `src/helpers.ts` as a reference.

3. Finally, you need to add the verify-identity link to your website. This link has the following format (don't forget to replace `${invitation}` by the invitation link you received):

```
https://app-api.archipels.io/presentation-requests/initialize?message=/verify-identity&invitation=${invitation}
```

That's it, you're all set up! 🎉
If you want to learn more about the different steps, keep on reading!

## Run the demo locally

To run the demo locally, you need to:

1. Clone the repository and move to the `identity-check` folder
2. Tunnel your localhost to the outside world (for example with `ngrok http localhost:3000`)
3. Set up your environment variables in the `Dockerfile`
4. Build the Docker image with `docker build -t identity-check .`
5. Run the Docker image with `docker run -p 3000:3000 identity-check`
6. Open your browser and go to `http://localhost:3000`

That's it, you're ready to verify your users' identity! 🎉
