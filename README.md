# Archipels Wallet

![](https://cdn.prod.website-files.com/603d1ab751f8514b6baee231/6560a7750cfd09f96fe26e44_Archipels%20C%20H%20Logo%20(1).-p-800.png)


Archipels is a web application and API platform designed for digital identity and credential management. Whether you’re an individual or a business, Archipels provides a secure and efficient way to manage your digital wallets, access tokens, webhooks, and invitations. In this guide, you will learn how to set up and interact with Archipels' various environments, retrieve necessary data, and perform key tasks through the provided APIs.

[Create your wallet](https://app.archipels.io) 

This repository is under active development. Feedback, issues, and PRs are highly appreciated.

## Key Features

-   **Create decentralized identities for you or your organizations**. 
    
-   **Collect and manage verifiable attestations**
    
-   **Use your attestations to prove who you are**
    
-   **Create your own attestations and send them to wallets**
    
-   **Send and receive secure messages to other wallets**
    
-   **Create and configure Applications to support your use-cases**
    
-   **Integrate your wallet with other applications via Access-Tokens and Webhooks**

## Discover

> This repository is intended for developers. If you just want to install and use the app as it is, please follow the [User Guide](https://docs-v1.archipels.io/archipels-documentation). 

If you want to discover what you can do with Archipels, you're in the right place! This guide will help you get up and running before diving in the details of each usecase.

First, let's set up the common base you will need for all examples.

### Create a Wallet

Go to [Archipels](https://app.archipels.io) and follow the onboarding process to create your personal or business wallet.

### Create an access token

Go to [Settings > Access tokens](https://app.archipels.io/settings-access-token) and click on "**Create an access token**", set a token name and select all scopes, then click create.

> **Important:** save your `ACCESS_TOKEN`

### Next steps

🏆 That's it, you're all set up! Now you can explore any example you want! Follow the directory names or use the list below to choose:
1. [Authentication](./authentication/README.md) - Start with this one if you're new to Self-Sovereign Identity or Archipels!
2. [Identity Check](./identity-check/README.md) - Want to verify the identity of your users?

### Common steps

Most examples will require you to set up a few things. A complete guide can be found in the [Common steps guide](./COMMON_STEPS.md)

### Feeling lost?

If you're not familiar with SSI (Self-Sovereign Identity), you might feel a little overwhelmed with unknown terms.
That's normal! It represents a paradigm shift away from centralized identity (our ID cards are delivered by a central state) and IDPs (IDentity Providers, intermediaries like Google or Facebook we trust with our personal information when we log in without creating an account on a website).

But don't worry, the basic concepts are simple enough to grasp.
To authenticate without a password and without intermediaries, you establish a secure connection between your app's wallet and the wallet of your user.

> A wallet is, like in real life, a collection of stuff (only digital).

Let's go through an example. Suppose you want to verify that one of your users has an email address. To do this, you request an email attestation from the user's wallet. We call them the _holder_ and you the _verifier_. _Attestations_, or _verifiable credentials_ are what holders hold in their wallets.

Most likely, the user already has one in this case. If not, they can request one from an _issuer_ (Archipels for example).

Once they present it, you (the verifier) check that you trust the issuer. If you do, you now know that your user's email address is valid.

![Triangle of Trust](https://upload.wikimedia.org/wikipedia/commons/5/51/VC_triangle_of_Trust.svg)

When the user presents an attestation, the protocols behind guarantee that it has not been falsified, has not been tampered with and has indeed been issued by the issuer it claims. The technology allows us to think about the only question that really matters:

> Do I trust the issuer, that is, do I trust the human behind it?

Behind the scenes, attestations are nothing more than JSON objects. To request and issue them, we use _schemas_, which are simply attestation blueprints. They indicate which attributes they should contain:

```json
// (Archipel's) email schema
{
  "id": "dfe18fd1-182c-45f5-8d84-a200994e5ac9",
  "schemaId": "QuS72Sdp6eDD2jTDz43XoU:2:Email attestation:1.0",
  "name": "Email attestation",
  "attributes": [
    {
      "name": "emailAddress",
      "description": "Email"
    }
  ],
  // ...
}
```

Anyone can create schemas for others to issue and request attestations. This gives holders tremendous power, leading to a much more decentralized structure.

One final concept we need to understand are _connections_. This is the way you connect with all the actors. To initiate a secure communication channel between you and your user, we use invitations, which you can add to your website. When a user clicks one one such invitation, Archipels creates a secure connection between your wallets. It is then used to issue and verify attestations.

That's it! With this, you should understand all the building blocks of the examples in this repository. Specific concepts will be explained in the examples. If you want to dig deeper, these resources are great introductions to the subject (taken from this [great repo](https://github.com/animo/awesome-self-sovereign-identity)):
- [Self-Sovereign Identity (SSI) Explained](https://www.youtube.com/watch?v=kJAapPG_jBY) (video)
- [Self-Sovereign Identity: Decentralized digital identity and verifiable credentials](https://livebook.manning.com/book/self-sovereign-identity/welcome/) (book)
- [Introduction to Self-Sovereign Identity](https://walt.id/white-paper/self-sovereign-identity-ssi) (article)

Of course, you can use any other wallet alternative that uses the same protocol instead of Archipels. But why not use one of the most feature-rich options, which actively works with many industry giants and most SSI actors, while also being completely free for individual wallets? Discover more on [our website](https://www.archipels.io/)!
